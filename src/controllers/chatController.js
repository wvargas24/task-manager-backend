const Thread = require('../models/Thread');
const openai = require('../config/openai');

const createThread = async (req, res) => {
    const { userId, initialMessage } = req.body;

    const thread = new Thread({
        userId,
        messages: [{ message: initialMessage, sender: 'user' }]
    });

    await thread.save();
    res.status(201).json(thread);
};

const sendMessage = async (req, res) => {
    const { threadId } = req.params;
    const { message } = req.body;

    const thread = await Thread.findById(threadId);
    if (!thread) {
        return res.status(404).json({ message: 'Thread not found' });
    }

    thread.messages.push({ message, sender: 'user' });

    const prompt = thread.messages.map(m => `${m.sender}: ${m.message}`).join('\n');
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 150,
    });

    const botMessage = response.data.choices[0].text.trim();
    thread.messages.push({ message: botMessage, sender: 'bot' });

    await thread.save();
    res.json(thread);
};

const getThread = async (req, res) => {
    const { threadId } = req.params;

    const thread = await Thread.findById(threadId);
    if (!thread) {
        return res.status(404).json({ message: 'Thread not found' });
    }

    res.json(thread);
};

module.exports = {
    getThread,
    sendMessage,
    createThread
};