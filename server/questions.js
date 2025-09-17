// server/questions.js

const questions = {
    'software-engineer': {
        behavioral: [
            "Tell me about a time you had a conflict with a team member and how you resolved it.",
            "Describe a challenging project you worked on. What was your role, and what was the outcome?",
            "How do you stay updated with the latest technologies and trends in software development?",
            "Walk me through your process for debugging a complex issue.",
            "Tell me about a time you made a mistake at work. How did you handle it?"
        ],
        technical: [
            "What is the difference between REST and GraphQL?",
            "Explain the concept of closures in JavaScript.",
            "Describe the SOLID principles of object-oriented design.",
            "What is the purpose of a Docker container?",
            "How would you optimize a slow database query?"
        ]
    },
    'product-manager': {
        behavioral: [
            "How do you prioritize features for a new product?",
            "Tell me about a product you successfully launched from scratch.",
            "How do you handle disagreements with the engineering team?",
            "Describe a time a product launch didn't go as planned. What did you learn?",
            "What's a product you admire and why? How would you improve it?"
        ],
        technical: [
            "What are the key metrics you would track for a SaaS product?",
            "Explain the concept of an API to a non-technical person.",
            "How do you conduct market research?",
            "What is A/B testing and when would you use it?",
            "Walk me through the process of creating a product roadmap."
        ]
    },
    'data-analyst': {
        behavioral: [
            "Tell me about a time you used data to influence a business decision.",
            "How do you ensure the quality and accuracy of your data?",
            "Describe a situation where you had to present complex data to a non-technical audience.",
            "How do you handle missing or incomplete data?",
            "What are your favorite data visualization tools and why?"
        ],
        technical: [
            "What is the difference between a LEFT JOIN and an INNER JOIN in SQL?",
            "Explain the concept of statistical significance.",
            "Describe the process of data cleaning and preprocessing.",
            "What is a p-value?",
            "How would you build a simple predictive model?"
        ]
    }
};

module.exports = questions;