import conf from "../Data_management/conf/conf";
import {Client, Databases, Query} from "appwrite"

export class ClassAttendService{
    client = new Client();
    databases;
    attendClassesCollection;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
        this.databases = new Databases(this.client);
        this.databasesId = conf.appwriteDatabaseID;
        this.attendClassesCollection = conf.appwriteAttendClassesCollectionID;
    }

    async markAttendance(userId, Subjectname, SubjectId, day, time, date, status){
        try {
            const existing = await this.databases.listDocuments(
                this.databasesId,
                this.attendClassesCollection,
                [
                    Query.equal("UserID", userId),
                    Query.equal("SubjectID", SubjectId),
                    Query.equal("ClassDate", date)
                ]
            );
            if(existing.documents.length > 0){
                console.warn("Attendance for this class on this date already marked");
                return{
                    success: false,
                    message: "Attendance already marked",
                };
            }
            const marking_attendance = await this.databases.createDocument(
                this.databasesId,
                this.attendClassesCollection,
                "unique()",
                {
                    UserID: userId,
                    SubjectID: SubjectId,
                    SubjectName: Subjectname,
                    ClassDay: day,
                    ClassTime: time,
                    ClassDate: date,
                    Status: status
                }
            );
            return{
                success: true,
                message: "Attendance marked successfully",
                attendanceRecord: marking_attendance
            }
        } catch (error) {
            console.error("Not able to mark attendance",error.message);
            throw error;
        }
    }

    async updateAttendance(attendanceId, data){
        try {
            const record = await this.databases.getDocument(
                this.databasesId,
                this.attendClassesCollection,
                attendanceId
            );
            if(record.Status !== "Not"){
                return{
                    success: false,
                    message: "Attendance can only be updated if marked as Not Present",
                };
            }
            const updated = await this.databases.updateDocument(
                this.databasesId,
                this.attendClassesCollection,
                attendanceId,
                data
            );
            return{
                success: true,
                message: "Attendance updated successfully",
                updatedRecord: updated
            }
        } catch (error) {
            console.error("Not able to Update your Attendance ",error.message);
            throw error;
        }
    }

    async getUserAttendance(userId){
        try {
            const response = await this.databases.listDocuments(
                this.databasesId,
                this.attendClassesCollection,
                [Query.equal("UserID",userId)]
            );
            return response.documents;
        } catch (error) {
            console.error("Not able to fetch User Attendance",error.message);
            throw error;
        }
    }

    async deleteAttendance(attendanceId){
        try {
            return await this.databases.deleteDocument(
                this.databasesId,
                this.attendClassesCollection,
                attendanceId
            );
        } catch (error) {
            console.error("Not able to Delete your Attendance ",error.message);
            throw error;
        }
    }

    async getAttendanceBySubject(userId, subjectId) {
        try {
            const response = await this.databases.listDocuments(
                this.databasesId,
                this.attendClassesCollection,
                [
                    Query.equal("UserID", userId),
                    Query.equal("SubjectID", subjectId)
                ]
            );
            return response.documents;
        } catch (error) {
            console.error("Not able to fetch attendance by subject", error.message);
            throw error;
        }
    }

    async getAttendanceByDate(userId, date) {
        try {
            const response = await this.databases.listDocuments(
                this.databasesId,
                this.attendClassesCollection,
                [
                    Query.equal("UserID", userId),
                    Query.equal("ClassDate", date)
                ]
            );
            return response.documents;
        } catch (error) {
            console.error("Not able to fetch attendance by date", error.message);
            throw error;
        }
    }

    async markAsNot(userId, SubjectId, day, time, date){
        try{
            const existing = await this.databases.listDocuments(
                this.databasesId,
                this.attendClassesCollection,
                [
                    Query.equal("UserID", userId),
                    Query.equal("SubjectID", SubjectId),
                    Query.equal("ClassDate", date)
                ]
            );
            if(existing.documents.length > 0){
                console.warn("Attendance for this class on this date already marked");
                return{
                    success: false,
                    message: "Attendance already marked",
                };
            }

            const marking_not_attendance = await this.databases.createDocument(
                this.databasesId,
                this.attendClassesCollection,
                "unique()",
                {
                    UserID: userId,
                    SubjectID: SubjectId,
                    ClassDate: date,
                    Status: "Not",
                    Time: time,
                    Day: day
                }
            );
            return {
                success: true,
                message: "Attendance marked as not present",
                attendanceRecord: marking_not_attendance
            };
        } catch (error) {
            console.error("Not able to mark attendance as not present", error.message);
            throw error;
        }
    }
}

const classAttendService = new ClassAttendService();
export default classAttendService;