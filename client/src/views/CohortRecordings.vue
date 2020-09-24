<template>
  <div>
    <div class="row justify-center" style="height: 100vh">
      <div class="col-sm-12 col-md-6 col-lg-7">
        <div class="q-pa-md">
          <q-skeleton
            v-if="!classroom"
            tag="h5"
            width="200px"
            animation="wave"
            class="skeleton--header"
          />
          <h5 class="text-blue-grey-8 text-center">
            {{ classroom && classroom.cohortName }}
          </h5>
          <div class="row justify-center q-pt-lg">
            <q-date
              id="calendar"
              class="col-xs-12 col-sm-10"
              v-model="selectedDate"
              :options="options"
              color="deep-orange"
            />
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-10 col-md-6 col-lg-5 recording-list">
        <q-tab-panels
          v-model="selectedDate"
          animated
          transition-prev="fade"
          transition-next="fade"
        >
          <q-tab-panel v-if="emptyRecordingMessage" :name="selectedDate">
            <h5 class="q-mb-sm text-deep-orange-4">
              {{ emptyRecordingMessage }}
            </h5>
          </q-tab-panel>
          <q-tab-panel v-for="event in options" :key="event" :name="event">
            <h2 class="q-mb-sm text-blue-grey-10">
              {{ getDisplayDate(event) }}
            </h2>
            <h5
              v-if="recordingsDisplayed.length"
              class="q-mt-none text-blue-grey-5"
            >
              {{ recordingsDisplayed[0].meetingName }}
            </h5>
            <q-list separator bordered>
              <q-item
                v-for="recording in recordingsDisplayed"
                :key="recording.id"
              >
                <q-item-section>
                  <q-item-label class="text-deep-orange">
                    Summary
                  </q-item-label>
                  <q-item-label caption>
                    {{ recording.summary || "No summary available" }}
                    <router-link
                      v-if="isInstructor"
                      :to="{
                        path: `/${classroom.id}/recordings/${recording.id}/edit`,
                      }"
                    >
                      (edit)
                    </router-link>
                  </q-item-label>
                  <q-item-label class="q-pt-sm">
                    <a :href="recording.url" target="_blank">
                      View in Zoom
                    </a>
                  </q-item-label>

                  <q-item-label class="q-pt-md text-deep-orange"
                    >Password</q-item-label
                  >
                  <q-item-label caption>
                    <p :href="recording.url">{{ recording.password }}</p>
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-item-label caption>
                    {{ recording.duration }} minutes
                    <q-icon name="watch_later" />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script>
import { classroomsCollection } from "../firebase";
import { date } from "quasar";
import { auth } from "../firebase";

export default {
  name: "CohortRecordings",
  components: {},

  data() {
    const now = new Date();
    return {
      recordings: [],
      meetingName: this.$route.params.cohort,
      splitterModel: 65,
      selectedDate: this.dateStr(now),
      classroom: null,
      loading: true,
    };
  },

  async mounted() {
    const cohortRef = classroomsCollection.doc(this.meetingName);
    cohortRef.onSnapshot((snap) => {
      this.classroom = {
        id: cohortRef.id,
        ...snap.data(),
      };
    });

    cohortRef.collection("recordings").onSnapshot((snap) => {
      this.loading = false;
      this.recordings = snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    });
  },

  methods: {
    dateStr(d) {
      return date.formatDate(d, "YYYY/MM/DD");
    },
    getRecDate(recording) {
      return new Date(recording.date.seconds * 1000);
    },
    getDisplayDate(d) {
      const dateToFormat = typeof d === "string" ? new Date(d) : d;
      return date.formatDate(dateToFormat, "MMM DD, YYYY");
    },
  },

  computed: {
    isInstructor() {
      if (!this.classroom || !auth.currentUser) return false;

      return this.classroom.instructorId === auth.currentUser.uid;
    },

    options() {
      const dates = this.recordings.map((rec) => {
        const recDate = new Date(rec.date.seconds * 1000);
        return this.dateStr(recDate);
      });
      return [...new Set(dates)];
    },

    recordingsDisplayed() {
      return this.recordings.filter((r) => {
        const recDate = this.getRecDate(r);
        return this.selectedDate === this.dateStr(recDate);
      });
    },

    emptyRecordingMessage() {
      if (this.loading) return null;

      if (this.recordings && this.recordings.length === 0) {
        return "There are currently no recordings for this class";
      }

      if (!this.recordingsDisplayed.length) {
        return "There are no recordings for this date";
      }

      return null;
    },
  },
};
</script>

<style scoped>
.skeleton--header {
  margin-left: auto;
  margin-right: auto;
}

#calendar {
  height: 600px;
}

@media only screen and (min-width: 1024px) {
  .recording-list {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
