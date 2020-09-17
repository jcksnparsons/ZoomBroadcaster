<template>
  <div v-if="message">
    <h5 class="text-center text-blue-grey-8">{{ message }}</h5>
  </div>
</template>

<script>
import axios from "axios";
import { auth } from "../firebase";

const baseUrl = process.env.VUE_APP_APPROVE_REQUEST;
export default {
  data() {
    return {
      message: null,
    };
  },
  async mounted() {
    const { uid } = this.$route.query;
    const url = `${baseUrl}?uid=${uid}`;
    const res = await axios.post(url);
    const okResponse = res.status === 200;

    if (!okResponse) {
      this.message = "There was an error approving the user";
    }

    const isSelf = auth.currentUser ? auth.currentUser.uid === uid : false;

    if (okResponse && isSelf) {
      this.$q.notify({
        type: "positive",
        message: `Welcome ${auth.currentUser.displayName}!`,
      });
      this.$router.push(`/users/${auth.currentUser.uid}`);
    } else {
      this.message = "User has been approved";
    }
  },
};
</script>

<style></style>
