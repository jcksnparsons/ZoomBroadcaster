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
          type: "text",
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

export const buildInstructorDm = () => {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "Today's zoom recording is ready. Would you like to add a summary?",
        },
        accessory: {
          type: "button",
          action_id: "open_summary_modal_button",
          text: {
            type: "plain_text",
            text: "Add Summary",
            emoji: true,
          },
          value: "launch_button_click",
        },
      },
    ],
  };
};

export const buildModal = (triggerId: string, modalId: string) => {
  return {
    trigger_id: triggerId,
    view: {
      type: "modal",
      callback_id: modalId,
      title: {
        type: "plain_text",
        text: "Lecture Summary",
      },
      submit: {
        type: "plain_text",
        text: "Submit",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true,
      },
      blocks: [
        {
          type: "input",
          label: {
            type: "plain_text",
            text: "So, tell me about your day",
            emoji: true,
          },
          element: {
            type: "plain_text_input",
            multiline: true,
          },
          optional: false,
        },
      ],
    },
  };
};
