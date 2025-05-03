const User = require("../model/userModel")
const Flow = require("../model/flowModel")


 const createOrUpdateFlow = async (req, res) => {
  const { email, nodes, edges } = req.body;

  try {
    if (!email || !nodes || !edges) {
      return res.status(400).json({ error: 'email , node , edge all feilds are required' });
    }

   
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found.' });
    }


    const existingFlow = await Flow.findOne({ email });

    if (existingFlow) {
 
      existingFlow.nodes = nodes;
      existingFlow.edges = edges;

      await existingFlow.save();

      return res.status(200).json({ message: 'Flow updated successfully.', flow: existingFlow });
    } else {
      
      const newFlow = new Flow({
        email,
        nodes,
        edges
      });

      await newFlow.save();

      return res.status(201).json({ message: 'Flow created successfully.', flow: newFlow });
    }
  } catch (error) {
    console.error('Error saving/updating flow:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getFLow = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
      }
      const flow = await Flow.findOne({ email });
      if (!flow) {
        return res.status(404).json({ error: 'Flow not found for this user.' });
      }
      res.status(200).json({ flow });
                       
    } catch (error) {

        console.error('Error fetching flow:', error);
        res.status(500).json({ error: 'Internal server error.' });
        
    }
}
module.exports = {createOrUpdateFlow,getFLow}