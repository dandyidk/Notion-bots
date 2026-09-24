import { axios } from "@pipedream/platform";

export default defineComponent({
  async run({ steps, $ }) {
    const items = steps.Notion_API.$return_value.items;

    /* ------------------------------------------
     *  DISCORD CONFIG
     * ----------------------------------------*/
    const webhookURL =

      "Webhook URL here;
    /* PEOPLE MAP (Notion name → Discord ID) */
    const people = {
      "Notion Username": "DiscordID number",
       "Notion Username2": "DiscordID number2"
    };

    /* ------------------------------------------
     *  PROCESS EACH NOTION ITEM
     * ----------------------------------------*/
    for (const notionItem of items) {

            /* ------------------------------------------
       *  CREATED OR UPDATED
       * ----------------------------------------*/
      let isCreated = notionItem.created_time === notionItem.last_edited_time;
      let status =   notionItem.properties.Status.status.name
      if(status != "In progress") continue
    
      const properties = notionItem.properties;
      
      let title = "";
      let name = "";
      let dueDate = "";
      let color = 0x000000;
      let description =""
      let isUrgent = false

      /* ------------------------------------------
       *  ASSIGNEES → DISCORD MENTION
       * ----------------------------------------*/
      const assignees = properties?.Assignee?.people || [];
      let discordMention = "";

      for (const person of assignees) {
        const discordId = people[person.name];
        if (discordId) discordMention += ` <@${discordId}>`;
      }

      /* ------------------------------------------
       *  TASK NAME
       * ----------------------------------------*/
      const taskName = properties["Task name"]?.title;
      if (taskName?.length > 0) name = taskName[0].plain_text;


      /* ------------------------------------------
       *  Past Due (string for display)
       * ----------------------------------------*/
      if (properties["Past due"]?.formula?.string) {
        dueDate = properties["Past due"].formula.string;
      }

      /* ------------------------------------------
       *  TITLE
       * ----------------------------------------*/
      title = isCreated
        ? "New Task Created: " + name
        : "Task Update: " + name;

      /* ------------------------------------------
       *  TASK TYPES
       * ----------------------------------------*/
      let taskTypes = [];
      if (properties["Task type"]?.multi_select?.length > 0) {
        taskTypes = properties["Task type"].multi_select.map((t) => t.name);
      }

      const taskTypesString =
        taskTypes.length > 0 ? taskTypes.join(", ") : "None";

      /* ------------------------------------------
       *  DEADLINE COLOR LOGIC
       * ----------------------------------------*/
      const deadlineProp = properties["Due date"]?.date?.start;

      if (deadlineProp) {
        const now = new Date();
        const deadlineDate = new Date(deadlineProp);

        const diffMs = deadlineDate - now;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays>7) color = 0x0000ff; 
          else if (diffDays > 3 && diffDays<7)  color = 0xffff00
                                               
        else {color = 0xff0000; 
             isUrgent= true}
      } else {
        color = isCreated ? 0x00ff00 : 0xffffff;    
      }
      /* ------------------------------------------
       *  DESCRIPTION
       * ----------------------------------------*/
      if(isCreated) description += "\nNew task has been created, check the notion workspace for more description"
      if(isUrgent) description +=`\n WARNING!  ${dueDate} for the task deadline`
      description += `\n Don't forget to post today's updates `

      /* ------------------------------------------
       *  DISCORD EMBED
       * ----------------------------------------*/
      await new Promise((resolve) => setTimeout(resolve, 300));

      const embed = {
        title,
        description: description,
        color,
        fields: [
          {
            name: "Task Types",
            value: taskTypesString,
            inline: true,
          },
          {
            name: "Deadline",
            value: dueDate || "No deadline",
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      };

      /* ------------------------------------------
       *  SEND TO DISCORD
       * ----------------------------------------*/
      await axios($, {
        method: "POST",
        url: webhookURL + "?wait=1",
        headers: { "Content-Type": "application/json" },
        data: {
          content: discordMention,
          embeds: [embed],
        },
      });
    }

    return { sent: true, count: items.length };
  },
});
