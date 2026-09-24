# Notion Documentation & Tasks Bots

Bots that periodically fetch information from Notion databases, format it, and send updates to Discord using webhooks.

## Setup

**You will make mistakes during the deployment of this bot, so test this inside a private discord server not in the main one**

The following code is written with this notion database format with the exact same naming in mind, if you wish to change the format then you will have to edit the code to suit your new format:

#### Documentation database
<img width="1096" height="543" alt="image" src="https://github.com/user-attachments/assets/8fcc37b0-e62e-4b09-9c12-0404b5a3724c" />

The code uses 4 properties:

**Doc name**, for the name of documentation

**Category**, for the type of documentation

**Last edited by** to check who edited it

**Last updated time** to send to discord only the documentations that has been recently updated

The sent discord message format:

<img width="509" height="196" alt="image" src="https://github.com/user-attachments/assets/fba58557-7ee3-4dc4-9d65-0796a0b91823" />

---

#### Task database
<img width="1390" height="183" alt="image" src="https://github.com/user-attachments/assets/32816610-7a00-4d90-a49d-776989b5ac00" />

The code uses 7 properties:

**Task name** the name of the task

**Status** the status of the task with the following categories in mind:
- **In progress** Tasks in progress
- **Not started**
- **Stalled**
- **Done**

**Assignee** who is assigned to said task

**Due date** the due date to send in a sense of urgency

**Task type** type of task 

**Past due** how many days left before the deadline

**Updated at** when was the task last updated (to state to the user if the task was newly created or not)

The sent discord message format

<img width="694" height="760" alt="image" src="https://github.com/user-attachments/assets/ab2137d7-6ffc-4a70-95d6-d69529e4e19c" />

---

### Notion API Key

Follow the [Notion API integration guide](https://www.notion.com/help/create-integrations-with-the-notion-api).

In short:

1. The workspace owner/admin goes to **Workspace Settings → Developer**.
2. Enable **Developer Features**.
3. Go back to the workspace and open **Developer Tools → Connections**.
4. Select **New Connection**.
5. Create the connection and give it **Content access** and **Edit access** for the pages/databases the bot needs to access.
6. Go back to the connection's configuration page.
7. Copy the **Notion API key**.

---

### Discord Webhook URL

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

It is wise to maximize the timeout as much as possible, as a large database could take some time to be sent to Pipedream. **300 seconds** is the timeout I currently use.

---

## Notion Documentation Bot

The Documentation Bot periodically retrieves the Notion documentation database, formats the contents, and posts them to Discord.

<img width="365" height="374" alt="image" src="https://github.com/user-attachments/assets/eb7dc045-1259-43ac-afd1-f2ee21551ca6" />

### 1. Create the Trigger

Create a trigger event that runs at a certain time of day (e.g., **10 PM**).

### 2. Fetch the Notion Database

Create an action event that is a **Node.js** code step (search for **Node.js**) and copy and paste the [following code](./Documentation%20bot/Notion%20Fetch.js).

Test this event. An error will appear asking you to configure the **Notion API key** and **database ID**.

* For the **Notion API key**, follow the [Notion API Key](#notion-api-key) step.
* For the **Notion database ID**, go to the database. Its ID will be found inside the link. For example:

```text
https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                  Database ID
```

### 3. Send the Data to Discord

Create another action event, which is also a **Node.js** code step, and copy and paste the [following code](./Documentation%20bot/DiscordSend.js).

Edit the code so that the webhook URL variable contains your Discord webhook. Follow the [Discord Webhook URL](#discord-webhook-url) step.

Test it. If it works as intended, deploy it, and you are done! :D

---

## Notion Tasks Bot

The Tasks Bot periodically retrieves the Notion Tasks database, formats the contents, and posts them to Discord with the ability to mention people.

<img width="365" height="374" alt="image" src="https://github.com/user-attachments/assets/78ca18b8-d357-4c09-bef9-2f6a71fb9367" />

### 1. Create the Trigger

Create a trigger event that runs at a certain time of day (e.g., **9:30 PM**).

### 2. Fetch the Notion Database

Create an action event that is a **Node.js** code step (search for **Node.js**) and copy and paste the [following code](./Task%20Bot/Notionfetch.js).

Test this event. An error will appear asking you to configure the **Notion API key** and **database ID**.

* For the **Notion API key**, follow the [Notion API Key](#notion-api-key) step.
* For the **Notion database ID**, go to the database. Its ID will be found inside the link. For example:

```text
https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                  Database ID
```

### 3. Send the Data to Discord

Create another action event, which is also a **Node.js** code step, and copy and paste the [following code](./Task%20Bot/DiscordSend.js).

Edit the code so that the webhook URL variable contains your Discord webhook. Follow the [Discord Webhook URL](#discord-webhook-url) step.

> **Note:** This code allows the use of mentions in Discord.
>
> If you wish to mention the assignee, go to the `people` variable. For each user, enter the exact Notion username appearing in the database, and for each corresponding value, enter the user's Discord ID.
>
> To find a user's ID, right-click them, open **Developer Mode**, and select **Copy User ID**.

Test it. If it works as intended, deploy it, and you are done! :D
