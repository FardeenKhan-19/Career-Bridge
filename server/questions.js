const questions = {
    behavioral: {
        'software-engineer': [
            "Tell me about a time you had a conflict with a team member and how you resolved it.",
            "Describe a challenging project you worked on. What made it challenging and how did you handle it?",
            "How do you stay updated with the latest technology trends in software engineering?"
        ],
        'product-manager': [
            "How do you prioritize features when you have limited resources and competing stakeholders?",
            "Tell me about a product you admire and why it is well-designed.",
            "Describe a time you had to say 'no' to a feature request from an important executive."
        ],
        'data-analyst': [
            "Describe a project where you used data to drive a business decision.",
            "How do you ensure the quality and accuracy of your data analysis?",
            "Tell me about a time you had to present complex data to a non-technical audience."
        ],
        'marketing-specialist': [
            "Describe a successful marketing campaign you managed from start to finish.",
            "How do you measure the ROI of a marketing campaign?",
            "Tell me about a time a campaign did not perform as expected and what you learned."
        ]
    },
    technical: {
        'software-engineer': [
            "What is the difference between REST and GraphQL?",
            "Explain the concept of closures in JavaScript and provide a use case.",
            "How would you design a simple URL shortening service like TinyURL?"
        ],
        'data-analyst': [
            "What is the difference between a LEFT JOIN and an INNER JOIN in SQL?",
            "Explain what a p-value represents in statistical testing in simple terms.",
            "How would you approach cleaning a dataset with a large amount of missing values?"
        ]
    },
    situational: {
        'software-engineer': [
            "Imagine you discover a critical security vulnerability a day before a major product launch. What do you do?",
            "Your team is falling behind on a sprint deadline. How do you handle the situation?",
            "A junior developer on your team is consistently producing buggy code. How do you approach them?"
        ],
        'product-manager': [
            "Imagine your product's user engagement suddenly drops by 20%. What is your action plan?",
            "You are tasked with launching a new feature, but the engineering team says it will take twice as long as expected. What do you do?",
            "Two senior executives have conflicting visions for your product's direction. How do you navigate this?"
        ]
    }
};

module.exports = questions;
