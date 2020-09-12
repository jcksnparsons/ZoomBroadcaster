<template>
  <div class="row justify-center q-mt-xl">
    <div class="col-xs-10 col-md-6 col-lg-4 q-pt-xl">
      <h2 class="q-mb-sm text-blue-grey-10">
        {{ displayDate }}
      </h2>
      <h5 class="q-mt-none text-blue-grey-5">
        {{ cohort.cohortName }}
      </h5>
      <q-form>
        <q-input
          color="deep-orange"
          v-model="recording.summary"
          label="Summary"
          outlined
          type="textarea"
          placeholder="Topics, chapters, etc..."
        />
        <div class="row justify-end">
          <div class="col q-py-md">
            <q-btn @click="submit()" color="deep-orange">Submit</q-btn>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import { getRecordingsCollection, classroomsCollection } from "../firebase";
import { date } from "quasar";

export default {
  name: "RecordingSummaryForm",
  components: {},

  data() {
    const cohortId = this.$route.params.cohort;
    const recordingId = this.$route.params.recording;
    const recordingRef = getRecordingsCollection(cohortId).doc(recordingId);
    const cohortRef = classroomsCollection.doc(cohortId);
    return {
      recordingRef,
      cohortRef,
      cohort: {},
      recording: {},
    };
  },

  async mounted() {
    this.recording = await this.getRecording();
    this.cohort = await this.getCohort();
  },

  methods: {
    async getRecording() {
      const snap = await this.recordingRef.get();
      return await snap.data();
    },

    async getCohort() {
      const snap = await this.cohortRef.get();
      return await snap.data();
    },

    async submit() {
      await this.recordingRef.update(this.recording);
      this.$q.notify({
        type: "positive",
        message: "Video summary has been updated",
      });
      this.$router.push({ path: `/${this.cohortRef.id}` });
    },
  },

  computed: {
    displayDate() {
      if (!this.recording.date) return "";

      const d = new Date(this.recording.date.seconds * 1000);
      return date.formatDate(d, "MMM DD");
    },
  },
};
</script>
