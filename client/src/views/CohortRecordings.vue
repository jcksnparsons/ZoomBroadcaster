<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      :limits="[50, 70]"
      style="height: 100vh"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <h5 class="text-blue-grey-8 text-center">
            {{ classroom && classroom.cohortName }}
          </h5>
          <div class="row justify-center q-pt-lg">
            <q-date
              class="col-sm-12 col-md-10 col-lg-6"
              v-model="selectedDate"
              :options="options"
              color="deep-orange"
            />
          </div>
        </div>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="selectedDate"
          animated
          transition-prev="fade"
          transition-next="fade"
        >
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
                  <q-item-label class="text-deep-orange">Summary</q-item-label>
                  <q-item-label caption>{{
                    recording.summary || "No summary available"
                  }}</q-item-label>
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
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { classroomsCollection } from "../firebase";
import { date } from "quasar";

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
    };
  },

  async mounted() {
    const cohortRef = classroomsCollection.doc(this.meetingName);
    cohortRef.onSnapshot((snap) => {
      this.classroom = snap.data();
    });

    cohortRef.collection("recordings").onSnapshot((snap) => {
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
    showAll() {},
  },

  computed: {
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
  },
};
</script>
