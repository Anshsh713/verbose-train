//As conf is using to get acess to others js files for appwrite database by converting it to string
const conf = { 
  appwriteURL: String(import.meta.env.VITE_APPWRITE_URL), //Appwrite Project URL taking in string way so js can get it
  appwriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID), //Appwrite Project ID
  appwriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID), //Appwrite Database ID 
  appwriteScheduleCollectionID: String(import.meta.env.VITE_APPWRITE_SCHEDULE_COLLECTION_ID),
  appwriteAttendClassesCollectionID: String(import.meta.env.VITE_APPWRITE_ATTEND_CLASSES_COLLECTION_ID),
  appwriteBucketID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID), //Appwrite storage ID
};
//importing from .env file as variable name VITE_APPWRITE_...
export default conf; //export conf to use it in other files
