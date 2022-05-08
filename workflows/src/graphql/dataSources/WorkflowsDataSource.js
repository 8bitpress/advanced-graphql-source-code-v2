import { Connection, WorkflowClient } from "@temporalio/client";
import { DataSource } from "apollo-datasource";

import { DeleteAllUserData } from "../../temporal/workflows.js";

class WorkflowsDataSource extends DataSource {
  constructor() {
    super();
    const connection = new Connection();
    this.client = new WorkflowClient(connection.service);
  }

  // DELETE

  async deleteAllUserData(accountId) {
    try {
      const handle = await this.client.start(DeleteAllUserData, {
        taskQueue: "marked-app",
        workflowId: `delete-user-data-${accountId}`,
        args: [accountId]
      });
      await handle.result();
      return true;
    } catch {
      return false;
    }
  }
}

export default WorkflowsDataSource;
