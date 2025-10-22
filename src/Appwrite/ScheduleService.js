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
      const Today = new Date();
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const todayName = dayNames[Today.getDay()];

      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseID,
        this.ScheduleCollection,
        [Query.equal("UserID", userId)]
      );
      const Subjects = response.documents;
      const todaysclasses = [];
      Subjects.forEach((subject) => {
        if (subject.ClassesSchedule && Array.isArray(subject.ClassesSchedule)) {
          const Schedule = subject.ClassesSchedule.map((item) => {
            try {
              return JSON.parse(item);
            } catch (error) {
              return null;
            }
          }).filter(Boolean);
          const todaySchedules = Schedule.filter(
            (cls) => cls.day.toLowerCase() === todayName.toLowerCase()
          );
          if (todaySchedules.length > 0) {
            todaysclasses.push({
              subjectId: subject.$id,
              subjectName: subject.SubjectName,
              schedules: todaySchedules,
            });
          }
        }
      });
      return todaysclasses;
    } catch (error) {
      console.error("Error fetching today's classes:", error.message);
      throw error;
    }
  }
}

const scheduleService = new ScheduleService();
export default scheduleService;
