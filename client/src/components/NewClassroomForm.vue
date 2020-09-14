<template>
  <div>
    <q-card>
      <q-form>
        <q-card-section>
          <div class="row justify-between">
            <h5 class="q-my-sm text-deep-orange">
              New Zoom Meeting
            </h5>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-y-md column">
            <q-input
              square
              color="deep-orange"
              filled
              label="Zoom Meeting Name"
              v-model="form.meetingName"
              hint="NOTE: This is case sensitive and must be exact"
            />
            <q-input
              square
              color="deep-orange"
              filled
              label="Cohort Name"
              v-model="form.cohortName"
            />
            <q-input
              square
              color="deep-orange"
              filled
              label="Slack Channel"
              v-model="form.slackChannel"
            />
            <q-input
              square
              color="deep-orange"
              filled
              label="Instructor Slack Email"
              hint="NOTE: This must be the email you use for Slack"
              v-model="form.instructorSlackEmail"
            />
          </div>
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="blue-grey-8" @click="cancel()">
            Cancel
          </q-btn>
          <q-btn outline color="deep-orange" @click="update()">Update</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { QCard, QCardSection, QSeparator, QCardActions } from "quasar";
import { classroomsCollection, auth } from "../firebase";
import axios from "axios";

export default {
  components: { QCard, QCardSection, QSeparator, QCardActions },

  data() {
    return {
      form: {},
    };
  },

  methods: {
    async update() {
      const verifiedEmail = await this.verifySlackEmail();

      if (!verifiedEmail) {
        return;
      }

      const {
        meetingName,
        cohortName,
        slackChannel,
        instructorSlackEmail,
        instructorSlackId,
      } = this.form;
      const updates = {
        meetingName,
        cohortName,
        slackChannel,
        instructorSlackEmail,
        instructorSlackId,
        instructorId: auth.currentUser.uid,
      };

      const existingClassId = await this.getExistingClassroomId(
        this.form.meetingName
      );

      if (existingClassId) {
        await classroomsCollection
          .doc(existingClassId)
          .set(updates, { merge: true });
      } else {
        await classroomsCollection.add(updates);
      }

      this.$q.notify({
        type: "positive",
        message: existingClassId
          ? "Classroom Created. Existing recordings have been automatically added"
          : "Classroom Created",
      });

      this.$emit("cancel");
    },

    cancel() {
      this.$emit("cancel");
    },

    async verifySlackEmail() {
      const baseUrl = process.env.VUE_APP_SLACK_SEARCH_URL;
      const { data } = await axios.get(
        `${baseUrl}?email=${this.form.instructorSlackEmail}`
      );

      if (!data.ok) {
        this.$q.notify({
          type: "error",
          message:
            "Slack cannot verify instructor email. Make sure you are using the same email address used for slack",
        });
        return false;
      }

      this.form.instructorSlackId = data.user.id;
      return true;
    },

    async getExistingClassroomId(meetingName) {
      const querySnap = await classroomsCollection
        .where("meetingName", "==", meetingName)
        .get();

      if (querySnap.empty) return null;

      const doc = querySnap.docs[0];
      return doc.id;
    },
  },
};
</script>

<style></style>
