# Notion-Documentation & Tasks bots

Bots that periodically fetch information from Notion databases, format it, and send updates to Discord using webhooks.

## Setup

### Notion API key


Follow the [Notion API integration guide](https://www.notion.com/help/create-integrations-with-the-notion-api).

In short:

1. The workspace owner/admin goes to **Workspace Settings → Developer**.
2. Enable **Developer Features**.
3. Go back to the workspace and open **Developer Tools → Connections**.
4. Select **New Connection**.
5. Create the connection and give it **Content access** and **Edit access** for the pages/databases the bot needs to access.
6. Go back to the connection's configuration page.
7. Copy the **Notion API key**.


### Discord WebHook URL

1. Open the Discord channel where you want the bot to send messages.
2. Go to **Edit Channel → Integrations → Webhooks**.
3. Select **New Webhook**.
4. Give the webhook a name and choose a profile picture if desired.
5. Copy the **Webhook URL**.

---

## Workflow


The bots run using [Pipedream](https://pipedream.com/).

Create **one Pipedream project** containing two workflows:

* **Documentation Bot**
* **Tasks Bot**

Each workflow follows the same basic structure:

```text
Scheduled Trigger
       ↓
Node.js — Fetch Notion Database
       ↓
Node.js — Format & Send to Discord
```


Pipedream provides approximately **100 credits per month** on the plan being used.

If each bot runs once per day:

* 2 bots × 31 days = **62 executions/month**
* Assuming each execution consumes approximately 1 credit:
  **~62 credits/month**

It is wise to maximize the timeout as much as possible as large database could take some time before it is sent to pipedream, 300 seconds is the one i currently use 



### Notion Documentation bot

The Documentation Bot periodically retrieves the Notion documentation database, formats the contents, and posts them to Discord.

<img width="365" height="374" alt="image" src="https://github.com/user-attachments/assets/eb7dc045-1259-43ac-afd1-f2ee21551ca6" />

- Create a trigger event that triggers at a certain time of day (e.g. 10 pm)
- Create an action event that is a nodejs code (Search for nodejs) and copy paste the following code
- Test this event, an error will return where it asks for you to configure the notion api key and the database id
-   For the notion API key, follow the [[Notion API key]] step
-   For the notion database id, go to the database, its id will be found inside the link, For example:

```text
https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                  Database ID
```
- Create another action event which is also a nodejs code, and copy paste the following code
-   Edit the code so that the webhook URL variable contains your discord webhook, follow the [[Discord WebHook URL]] step

- Test it, if it works as intended, deploy it and you are done :D


---


