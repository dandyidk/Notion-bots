import { axios } from "@pipedream/platform";

export default defineComponent({
  async run({ steps, $ }) {
    const items = steps.code.$return_value.items;
    const colorMap = {
  red: 0xED4245,
  pink: 0xEB459E,
  purple: 0x9B59B6,
  blue: 0x3498DB,
  green: 0x2ECC71,
  yellow: 0xF1C40F,
  orange: 0xE67E22,
  brown: 0xA0522D,
  gray: 0x95A5A6,
  default: 0x5865F2,
};

    /* ------------------------------------------
     * DISCORD CONFIG
     * ----------------------------------------*/
    const webhookURL =
      "Send here";

    for (const notionItem of items) {
      /* ------------------------------------------
       * CREATED OR UPDATED
       * ----------------------------------------*/
      const createdTime = notionItem.created_time;
const lastEdited = notionItem.last_edited_time;

const isCreatedToday = (() => {
  const createdDate = new Date(createdTime);
  const today = new Date();
  return (
    createdDate.getUTCFullYear() === today.getUTCFullYear() &&
    createdDate.getUTCMonth() === today.getUTCMonth() &&
    createdDate.getUTCDate() === today.getUTCDate()
  );
})();

const isUpdatedToday = (() => {
  const editedDate = new Date(lastEdited);
  const today = new Date();
  return (
    editedDate.getUTCFullYear() === today.getUTCFullYear() &&
    editedDate.getUTCMonth() === today.getUTCMonth() &&
    editedDate.getUTCDate() === today.getUTCDate()
  );
})();

// Skip if neither created today nor updated today
if ( !isUpdatedToday) {
  continue;
}

// Determine if this is a creation or an update
const isCreated = isCreatedToday;


      let docName = ""
      let docTypes =""
      let lastEditedName=""
      const properties = notionItem.properties;

      /* ------------------------------------------
       * DOC NAME
       * ----------------------------------------*/
      let name = "";
      docName = properties["Doc name"]?.title?.[0]?.plain_text;
      if (docName) name = docName;

      /* ------------------------------------------
       * CATEGORY
       * ----------------------------------------*/
      const category = properties.Category.multi_select;
const notionColor = category?.[0]?.color || "default";
const color = colorMap[notionColor] || colorMap.default;
      if (Array.isArray(category) && category.length > 0) {
  docTypes = String(category[0].name || "N/A");
}

      /* ------------------------------------------
       * TITLE
       * ----------------------------------------*/
      const title = isCreated
        ? `New Documentation Created: ${name}`
        : `Documentation Update: ${name}`;

      /* ------------------------------------------
       * DESCRIPTION
       * ----------------------------------------*/
      let description = "";
      if (isCreated) {
        description += "\nNew Documentation page has been created";
      }
      /* ------------------------------------------
       * Last edited
       * ----------------------------------------*/
        lastEditedName= properties["Last edited by"].last_edited_by.name
      /* ------------------------------------------
       * SMALL DELAY
       * ----------------------------------------*/
      await new Promise((resolve) => setTimeout(resolve, 300));

      
      /* ------------------------------------------
       * DISCORD EMBED
       * ----------------------------------------*/
      const embed = {
        title,
        description,
        color,
        author: {
  name: lastEditedName,
  icon_url: properties["Last edited by"].last_edited_by.avatar_url || "",
},
        fields: [
          {
            name: "Documentation Types",
            value: docTypes,
            inline: true,
          },
           {
    name: "Last Edited By",
    value: lastEditedName || "Unknown",
    inline: true,
  },
        ],
        timestamp: new Date().toISOString(),
      };

      /* ------------------------------------------
       * SEND TO DISCORD
       * ----------------------------------------*/
      await axios($, {
        method: "POST",
        url: webhookURL + "?wait=1",
        headers: { "Content-Type": "application/json" },
        data: { embeds: [embed] },
      });
    }

    return { sent: true, count: items.length };
  },
});
