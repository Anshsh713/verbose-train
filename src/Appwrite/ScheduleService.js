import conf from "../Data_management/conf/conf";
import { Client, Databases, Query } from "appwrite";

export class ScheduleService {
  client = new Client();
  databases;
  ScheduleCollection;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteURL)
      .setProject(conf.appwriteProjectID);

    this.databases = new Databases(this.client);
    this.databasesId = conf.appwriteDatabaseID;
    this.ScheduleCollection = conf.appwriteScheduleCollectionID;
  }

  async AddSubject(userId, subjectName, classesSchedule) {
    try {
      const existing = await this.databases.listDocuments(
        this.databasesId,
        this.ScheduleCollection,
        [Query.equal("UserID", userId), Query.equal("SubjectName", subjectName)]
      );
      if (existing.documents.length > 0) {
        console.warn("Subject already exists");
        return {
          success: false,
          message: "Subject already exists",
          existingSubject: existing.documents[0],
        };
      }
      const adding_subject = await this.databases.createDocument(
        this.databasesId,
        this.ScheduleCollection,
        "unique()",
        {
          UserID: userId,
          SubjectName: subjectName,
          ClassesSchedule: classesSchedule,
        }
      );
      return this.getUserSubject(userId);
    } catch (error) {
      console.error("Not able to Add Your Subject list", error.message);
      throw error;
    }
  }

  async updateSubject(SubjectId, data) {
    try {
      return await this.databases.updateDocument(
        this.databasesId,
        this.ScheduleCollection,
        SubjectId,
        data
      );
    } catch (error) {
      console.error("Not able to Update your Subject ", error.message);
      throw error;
    }
  }

  async getUserSubject(userId) {
    try {
      const response = await this.databases.listDocuments(
        this.databasesId,
        this.ScheduleCollection,
        [Query.equal("UserID", userId)]
      );
      return response.documents;
    } catch (error) {
      console.error("As No Subject is Added Please Add your Subject");
      throw error;
    }
  }

  async deleteSubject(SubjectId) {
    try {
      return await this.databases.deleteDocument(
        this.databasesId,
        this.ScheduleCollection,
        SubjectId
      );
    } catch (error) {
      console.log("Unable to Delete your Subject");
      return false;
    }
  }

  async getTodayClasses(userId) {
    try {
      const today = new Date();
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const todayName = dayNames[today.getDay()].toLowerCase();

      // Fetch all subjects for the user
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseID,
        this.ScheduleCollection,
        [Query.equal("UserID", userId)]
      );

      const todaysClasses = [];

      for (const subject of response.documents) {
        if (!subject.ClassesSchedule || !Array.isArray(subject.ClassesSchedule))
          continue;

        // Parse schedules and filter today's schedules in one go
        const todaySchedules = [];
        for (const item of subject.ClassesSchedule) {
          try {
            const cls = JSON.parse(item);
            if (cls.day && cls.day.toLowerCase() === todayName) {
              todaySchedules.push(cls);
            }
          } catch (error) {
            continue; // skip invalid JSON
          }
        }

        if (todaySchedules.length) {
          todaysClasses.push({
            userId,
            subjectId: subject.$id,
            subjectName: subject.SubjectName,
            schedules: todaySchedules,
          });
        }
      }

      console.log("Today's Classes:", todaysClasses);
      return todaysClasses;
    } catch (error) {
      console.error("Error fetching today's classes:", error.message);
      throw error;
    }
  }
}

const scheduleService = new ScheduleService();
export default scheduleService;
