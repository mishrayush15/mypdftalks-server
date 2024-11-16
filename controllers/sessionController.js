const fs = require('fs');
const pdfparse = require('pdf-parse');
const sessionModel = require('../models/sessionModel')
const userModel = require('../models/userModel')
const zod = require('zod');
const gemini = require('../ai/gemini')


// -- Handling file upload and session creation --
const uploadFile = async (req, res) => {

    const userId = req.userId;
    const pdfpath = req.file.path;
    const dataBuffer = fs.readFileSync(pdfpath);
    const pdfData = await pdfparse(dataBuffer)


    try {
        const user = await userModel.findOne({ _id: userId });
        const prevSessionCheck = await sessionModel.findOne({ userId });
        if (prevSessionCheck) {
            const prevSession = await sessionModel.findOneAndDelete({ userId });
            await userModel.updateOne(
                { _id: userId },
                { $pull: { sessionId: prevSession._id } } 
            );
            
        }
        const session = await sessionModel.create({
            pdfData: pdfData.text,
            userId,
        });
        user.sessionId.push(session._id);
        await user.save();
        res.status(200).json({
            message: "file uploaded successfully"
        })

    } catch (error) {
        res.stauts(400).json({
            message: "error occured while operation"
        });
    } finally {
        fs.unlink(pdfpath, (err) => {
            if (err) res.status(500).json({
                message: "error occured while operation"
            })
        })
    };
}


// -- Conversation history --
const getConverstaions = async (req, res) => {
    try{
        const conversations = await sessionModel.findOne({userId : req.userId});
        if(!conversations.conversationHistory || conversations.conversationHistory == "") return res.status(403).json({
            message : "No conversation history"
        })
        res.status(200).json({
            history : conversations.conversationHistory
        });
    }catch(error){
        res.status(403).json({
            message : "error while performing operation"
        })
    }
}


// -- Sending query to GEMINI AI and storing the conversations --
const queryBody = zod.object({
    question : zod.string(),
})
const sendQuery = async (req, res) => {
    const {success} = queryBody.safeParse(req.body);
    if(!success) return res.status(403).json({
        message : "unable to fetch data"
    })
    try{
        const question = req.body;
        const userId = req.userId;
        const session = await sessionModel.findOne({userId});
        const answer = await gemini(question, session.pdfData);
        if(!answer || answer == "") return res.status(400).json({
            message : "unable to perform the operation at the moment"
        })
        session.conversationHistory.push({
            question : question.question,
            answer
        })
        await session.save();
        res.status(200).json({
            response : answer
        })
    }catch(error){
        res.status(400).json({
            messgae : "unable to perform operation at the moment"
        })
    }
}


module.exports = {uploadFile, getConverstaions, sendQuery};