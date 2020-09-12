import { SlackOptions } from "./SlackOptions";

export const buildChannelSlackMessage = (
  slackOptions: SlackOptions,
  appUrl: string
) => {
  const { zoomLink, zoomPassword, cohortId } = slackOptions;
  console.log("Building link for channel", `${appUrl}/${cohortId}`);

  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: `A new zoom recording has been added for your classroom.\nPassword: ${zoomPassword}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            style: "primary",
            text: {
              type: "plain_text",
              text: "View New Recording",
            },
            url: zoomLink,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View All Recordings",
            },
            url: `${appUrl}/${cohortId}`,
          },
        ],
      },
    ],
  };
};

export const buildInstructorDm = (
  slackOptions: SlackOptions,
  appUrl: string
) => {
  return {
    channel: slackOptions.instructorSlackId,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `The Zoom recording for *${slackOptions.recordingDate.toLocaleDateString()}*  is ready. Would you like to add a summary?`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            style: "primary",
            text: {
              type: "plain_text",
              text: "Add Summary",
            },
            url: `${appUrl}/${slackOptions.cohortId}/recordings/${slackOptions.recordingId}/edit`,
          },
        ],
      },
    ],
  };
};
