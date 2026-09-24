import { axios } from "@pipedream/platform";

export default defineComponent({
  props: {
    notionApiKey: {
      type: "string",
      label: "Notion API Key",
      secret: true,
    },
    databaseId: {
      type: "string",
      label: "Notion Database ID",
    },
  },

  async run({ steps, $ }) {
    const token = this.notionApiKey;
    const database = this.databaseId;

    let hasMore = true;
    let nextCursor = undefined;
    let allItems = [];

    while (hasMore) {
      const response = await axios($, {
        method: "POST",
        url: "https://api.notion.com/v1/databases/" + database + "/query",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        data: nextCursor ? { start_cursor: nextCursor } : {},
      });

      allItems.push(...response.results);

      hasMore = response.has_more;
      nextCursor = response.next_cursor;
    }

    // Return everything
    return {
      total: allItems.length,
      items: allItems,
    };
  },
});
