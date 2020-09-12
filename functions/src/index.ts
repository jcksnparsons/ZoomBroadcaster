import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import config from "./config";
import { SlackOptions } from "./SlackOptions";
import { buildChannelSlackMessage, buildInstructorDm } from "./slackBuilder";

admin.initializeApp();

export const zoomRecordingReady = functions.https.onRequest(
  async (request, response) => {
    // Check auth header to confirm Zoom is making the request
    if (request.headers.authorization !== config.env.zoom.verificationToken) {
      console.log("Could not validate the zoom verification token");
      response.status(401).send("Unauthorized");
      return;
    }

    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const classroomsRef = admin.firestore().collection("classrooms");
    const { payload } = request.body;
    const { topic, password, share_url, start_time, duration } = payload.object;

    const recording = {
      password,
      meetingName: topic,
      url: share_url,
      date: new Date(start_time),
      duration,
    };

    let classRef: FirebaseFirestore.DocumentReference;
    let classroomHasBeenClaimed = false;
    const query = await classroomsRef
      .where("meetingName", "==", recording.meetingName)
      .get();

    if (query.empty) {
      classRef = await classroomsRef.add({
        meetingName: recording.meetingName,
      });
    } else {
      classroomHasBeenClaimed = true;
      classRef = query.docs[0].ref;
    }

    const newRecordingRef = await classRef
      .collection("recordings")
      .add(recording);

    // If classroom has been claimed by an instructor and has slack details, send notification
    if (classroomHasBeenClaimed) {
      const classSnap = await classRef.get();
      const classData = await classSnap.data();
      const slackOptions: SlackOptions = {
        cohortId: classRef.id,
        channel: `#${classData?.slackChannel}`,
        instructorEmail: classData?.instructorSlackEmail,
        instructorSlackId: classData?.instructorSlackId,
        zoomLink: recording.url,
        zoomPassword: recording.password,
        recordingDate: recording.date,
        recordingId: newRecordingRef.id,
      };

      await sendSlackMessages(slackOptions, config.env.app.url);
    }

    response.status(200).send();
    return;
  }
);

const sendSlackMessages = async (
  options: SlackOptions,
  appUrl: string
): Promise<void> => {
  const { botAccessToken } = config.env.slack;
  const slackUrl = "https://slack.com/api/chat.postMessage";

  const channelPayload = {
    channel: options.channel,
    ...buildChannelSlackMessage(options, appUrl),
  };

  console.log("Sending zoom link");
  const channelResponse = await axios.post(slackUrl, channelPayload, {
    headers: {
      Authorization: `Bearer ${botAccessToken}`,
    },
  });

  console.log(channelResponse.data.error || "Zoom link sent to channel");

  const instructorPayload = buildInstructorDm(options, appUrl);
  const instructorResponse = await axios.post(slackUrl, instructorPayload, {
    headers: {
      Authorization: `Bearer ${botAccessToken}`,
    },
  });

  console.log(instructorResponse.data.error || "Zoom link sent to instructor");
};
