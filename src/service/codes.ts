import { Code } from "@/interface/common";
import admin from "./firebaseAdmin";
import { sortCodesOnCreateTime } from "@/helpers";
export default new class CodesService {
    firestore = admin.firestore()
    getRegistrationCodes = async () => {
        try {
            const collection = this.firestore.collection('codes').where('type','==', 'register')
            const docs = await collection.get()
            const registrationCodes = docs.docs.map(data => {
                return {
                    type: data.get('type'),
                    createTime: data.get('createTime'),
                    value: data.get('value')
                }
            }) as Code []
            return sortCodesOnCreateTime(registrationCodes) 
        } catch (error) {
            console.log(error)
        }
    }

    getAdminCodes = async () => {
        try {
            const collection = this.firestore.collection('codes').where('type','==', 'admin')
            const docs = await collection.get()
            const adminCodes = docs.docs.map(data => {
                return {
                    type: data.get('type'),
                    createTime: data.get('createTime'),
                    value: data.get('value')
                }
            }) as Code []

            return sortCodesOnCreateTime(adminCodes)

        } catch (error) {
            console.log(error)
        }
    }

  
}()