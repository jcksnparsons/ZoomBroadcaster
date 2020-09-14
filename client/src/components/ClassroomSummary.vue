<template>
  <div>
    <q-card>
      <q-form>
        <q-card-section>
          <div class="row justify-between">
            <h5 class="q-my-sm text-deep-orange">
              {{ classroom.meetingName }}
            </h5>
            <div>
              <q-btn
                flat
                round
                color="deep-orange"
                icon="edit"
                title="edit"
                @click="editing = true"
              />
            </div>
          </div>
          <router-link :to="{ path: `/${classroom.id}` }">
            View Recordings
          </router-link>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-y-md column">
            <q-input
              square
              color="deep-orange"
              filled
              label="Zoom Meeting Name"
              disable
              v-model="form.meetingName"
            />
            <q-input
              square
              color="deep-orange"
              filled
              label="Cohort Name"
              :disable="!editing"
              v-model="form.cohortName"
            />
            <q-input
              square
              color="deep-orange"
              filled
              label="Slack Channel"
              :disable="!editing"
              v-model="form.slackChannel"
            />
            <q-input
              square
              color="deep-orange"
              filled
              label="Instructor Slack Email"
              :hint="editing ? 'This must be the email you use for Slack' : ''"
              :disable="!editing"
              v-model="form.instructorSlackEmail"
            />
          </div>
        </q-card-section>
        <q-separator v-if="editing" />

        <q-card-actions align="right" v-if="editing">
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
import { classroomsCollection } from "../firebase";
import axios from "axios";

export default {
  components: { QCard, QCardSection, QSeparator, QCardActions },
  props: ["classroom"],
  data() {
    return {
      editing: false,
      form: { ...this.classroom },
    };
  },

  methods: {
    async update() {
      const prevEmail = this.classroom.instructorSlackEmail;
      const updatedEmail = this.form.instructorSlackEmail;
      if (prevEmail !== updatedEmail) {
        const verifiedEmail = await this.verifySlackEmail();

        if (!verifiedEmail) {
          return;
        }
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
      };

      await classroomsCollection
        .doc(this.classroom.id)
        .set(updates, { merge: true });

      this.editing = false;
      this.$q.notify({
        type: "positive",
        message: "Classroom Updated",
      });
    },

    cancel() {
      this.editing = false;
      this.form = { ...this.classroom };
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
  },
};
</script>

<style></style>
