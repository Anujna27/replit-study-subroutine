// script.js - Main Application Logic

// Sample Data
const SUBJECTS_DATA = {
    "Physics": ["Electrostatics", "Optics", "Modern Physics", "Mechanics", "Waves", "Thermodynamics"],
    "Mathematics": ["Calculus", "Algebra", "Coordinate Geometry", "Trigonometry", "Probability", "Vectors"],
    "Chemistry": ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Chemical Bonding", "Equilibrium"],
    "Biology": ["Genetics", "Ecology", "Human Physiology", "Plant Morphology", "Cell Biology"],
    "English": ["Grammar", "Writing Skills", "Comprehension", "Literature", "Vocabulary"]
};

const HABIT_TEMPLATES = {
    "conceptual": [
        "Watch one 10-minute video explanation of {topic} before study session",
        "Explain {topic} concept to someone without notes",
        "Create mind map for {topic} key concepts",
        "Write summary in your own words for {topic}"
    ],
    "application": [
        "Solve 2 {topic} problems daily with timer",
        "Analyze 1 previous mistake in {topic} and re-solve",
        "Practice {topic} formulas derivation for 10 minutes",
        "Attempt one previous year question from {topic}"
    ],
    "retention": [
        "Create flashcards for {topic} and review before bed",
        "Use Pomodoro technique: 25min study, 5min recall for {topic}",
        "Draw diagrams from memory for {topic}",
        "Teach {topic} to imaginary student for 10 minutes"
    ],
    "practice": [
        "Daily one {topic} worksheet problem",
        "Weekly {topic} mock test simulation",
        "Solve mixed {topic} problems for variety",
        "Time-bound {topic} practice session"
    ]
};

class StudyHabitBuilder {
    constructor() {
        this.subjects = [];
        this.initializeApp();
    }

    initializeApp() {
        this.initializeSubjectSelect();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addSubjectBtn').addEventListener('click', () => this.addSubject());
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzePerformance());
        document.getElementById('downloadBtn').addEventListener('click', () => this.generatePDF());
    }

    initializeSubjectSelect() {
        const subjectSelect = document.getElementById('subjectSelect');
        subjectSelect.innerHTML = '<option value="">Choose a subject</option>';
        
        Object.keys(SUBJECTS_DATA).forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });
    }

    addSubject() {
        const subjectSelect = document.getElementById('subjectSelect');
        const subject = subjectSelect.value;
        
        if (!subject) {
            alert('Please select a subject');
            return;
        }
        
        if (this.subjects.find(s => s.name === subject)) {
            alert('Subject already added');
            return;
        }

        this.subjects.push({
            name: subject,
            topics: []
        });

        this.renderSubjects();
        subjectSelect.value = '';
    }

    renderSubjects() {
        const container = document.getElementById('subjectsContainer');
        container.innerHTML = '';

        if (this.subjects.length === 0) {
            container.innerHTML = '<p class="no-subjects">No subjects added yet. Start by adding a subject above.</p>';
            return;
        }

        this.subjects.forEach((subject, subjectIndex) => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            subjectCard.innerHTML = `
                <h3>${subject.name}</h3>
                <div class="topics-list" id="topics-${subjectIndex}">
                    ${this.renderTopicsList(subjectIndex)}
                </div>
                <div class="topic-controls">
                    <div class="input-group">
                        <label for="topicSelect-${subjectIndex}">Select Topic:</label>
                        <select id="topicSelect-${subjectIndex}">
                            <option value="">Choose a topic</option>
                            ${SUBJECTS_DATA[subject.name].map(topic => 
                                `<option value="${topic}">${topic}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="marksInput-${subjectIndex}">Marks (0-100):</label>
                        <input type="number" id="marksInput-${subjectIndex}" 
                               placeholder="Enter marks" min="0" max="100" class="marks-input">
                    </div>
                    <button onclick="app.addTopicToSubject(${subjectIndex})">Add Topic & Marks</button>
                    <button onclick="app.removeSubject(${subjectIndex})" class="remove-btn">Remove Subject</button>
                </div>
            `;
            container.appendChild(subjectCard);
        });
    }

    renderTopicsList(subjectIndex) {
        const topics = this.subjects[subjectIndex].topics;
        if (topics.length === 0) {
            return '<p class="no-topics">No topics added yet. Add topics and marks above.</p>';
        }
        
        return topics.map(topic => `
            <div class="topic-input">
                <strong>${topic.name}</strong>
                <span>Marks: ${topic.marks}/100</span>
                <span class="priority-badge ${this.getPriorityClass(topic.marks)}">
                    ${this.getPriorityText(topic.marks)}
                </span>
                <button onclick="app.removeTopic(${subjectIndex}, '${topic.name}')" class="remove-btn">Remove</button>
            </div>
        `).join('');
    }

    addTopicToSubject(subjectIndex) {
        const topicSelect = document.getElementById(`topicSelect-${subjectIndex}`);
        const marksInput = document.getElementById(`marksInput-${subjectIndex}`);
        
        const topic = topicSelect.value;
        const marks = parseInt(marksInput.value);

        if (!topic) {
            alert('Please select a topic');
            return;
        }

        if (isNaN(marks) || marks < 0 || marks > 100) {
            alert('Please enter valid marks between 0 and 100');
            return;
        }

        // Check if topic already exists
        const subject = this.subjects[subjectIndex];
        if (subject.topics.find(t => t.name === topic)) {
            alert('This topic has already been added');
            return;
        }

        subject.topics.push({
            name: topic,
            marks: marks,
            percentage: marks
        });

        this.renderSubjects(); // Re-render to update the topics list
    }

    removeSubject(subjectIndex) {
        this.subjects.splice(subjectIndex, 1);
        this.renderSubjects();
    }

    removeTopic(subjectIndex, topicName) {
        const subject = this.subjects[subjectIndex];
        subject.topics = subject.topics.filter(t => t.name !== topicName);
        this.renderSubjects();
    }

    getPriorityClass(percentage) {
        if (percentage < 60) return 'priority-high';
        if (percentage < 80) return 'priority-medium';
        return 'priority-low';
    }

    getPriorityText(percentage) {
        if (percentage < 60) return 'Needs Improvement';
        if (percentage < 80) return 'Moderate';
        return 'Strong';
    }

    analyzePerformance() {
        if (this.subjects.length === 0) {
            alert('Please add at least one subject');
            return;
        }

        // Check if any subject has topics
        const hasTopics = this.subjects.some(subject => subject.topics.length > 0);
        if (!hasTopics) {
            alert('Please add topics and marks for your subjects');
            return;
        }

        const analysis = this.generateAnalysis();
        this.displayAnalysis(analysis);
        this.displayHabits(analysis);
        
        // Scroll to analysis section
        document.getElementById('analysisSection').scrollIntoView({ behavior: 'smooth' });
    }

    generateAnalysis() {
        const analysis = {
            weakAreas: [],
            moderateAreas: [],
            strongAreas: [],
            subjectAnalysis: {}
        };

        this.subjects.forEach(subject => {
            subject.topics.forEach(topic => {
                const area = {
                    subject: subject.name,
                    topic: topic.name,
                    marks: topic.marks,
                    percentage: topic.percentage,
                    problemType: this.identifyProblemType(topic.percentage, subject.name)
                };

                if (topic.percentage < 60) {
                    analysis.weakAreas.push(area);
                } else if (topic.percentage < 80) {
                    analysis.moderateAreas.push(area);
                } else {
                    analysis.strongAreas.push(area);
                }
            });
        });

        return analysis;
    }

    identifyProblemType(percentage, subject) {
        // Simple heuristic - can be enhanced with more sophisticated logic
        if (percentage < 40) return "conceptual";
        if (percentage < 60) return "application";
        if (percentage < 75) return "retention";
        return "practice";
    }

    displayAnalysis(analysis) {
        const analysisSection = document.getElementById('analysisSection');
        const improvementAreas = document.getElementById('improvementAreas');
        
        analysisSection.style.display = 'block';

        improvementAreas.innerHTML = `
            ${analysis.weakAreas.length > 0 ? `
                <div class="analysis-card priority-high">
                    <h3>🚨 High Priority Areas (${analysis.weakAreas.length})</h3>
                    ${analysis.weakAreas.map(area => `
                        <p><strong>${area.subject} - ${area.topic}</strong>: ${area.marks}% (${area.problemType} issue)</p>
                    `).join('')}
                </div>
            ` : ''}
            
            ${analysis.moderateAreas.length > 0 ? `
                <div class="analysis-card priority-medium">
                    <h3>⚠️ Moderate Priority Areas (${analysis.moderateAreas.length})</h3>
                    ${analysis.moderateAreas.map(area => `
                        <p><strong>${area.subject} - ${area.topic}</strong>: ${area.marks}% (Needs more ${area.problemType})</p>
                    `).join('')}
                </div>
            ` : ''}
            
            ${analysis.strongAreas.length > 0 ? `
                <div class="analysis-card priority-low">
                    <h3>✅ Strong Areas (${analysis.strongAreas.length})</h3>
                    ${analysis.strongAreas.map(area => `
                        <p><strong>${area.subject} - ${area.topic}</strong>: ${area.marks}% (Maintain with light practice)</p>
                    `).join('')}
                </div>
            ` : ''}
        `;
    }

    displayHabits(analysis) {
        const habitsSection = document.getElementById('habitsSection');
        const habitsOutput = document.getElementById('habitsOutput');
        
        habitsSection.style.display = 'block';

        const weeklyPlan = this.generateWeeklyPlan(analysis);
        habitsOutput.innerHTML = weeklyPlan;
    }

    generateWeeklyPlan(analysis) {
        let planHTML = '<div class="weekly-plan">';
        
        // High Priority Habits
        if (analysis.weakAreas.length > 0) {
            planHTML += `
                <div class="priority-section">
                    <h3>🎯 Critical Improvement Habits (Daily)</h3>
                    ${analysis.weakAreas.map(area => `
                        <div class="habit-card priority-high">
                            <span class="habit-frequency">Daily</span>
                            <h4>${area.subject} - ${area.topic}</h4>
                            <p>${this.getHabitForArea(area)}</p>
                            <small>Focus: ${area.problemType} | Target: 60%+</small>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Moderate Priority Habits
        if (analysis.moderateAreas.length > 0) {
            planHTML += `
                <div class="priority-section">
                    <h3>📈 Improvement Maintenance (3-4 times/week)</h3>
                    ${analysis.moderateAreas.map(area => `
                        <div class="habit-card priority-medium">
                            <span class="habit-frequency">3-4x/week</span>
                            <h4>${area.subject} - ${area.topic}</h4>
                            <p>${this.getHabitForArea(area)}</p>
                            <small>Focus: ${area.problemType} | Target: 80%+</small>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Strong Areas Maintenance
        if (analysis.strongAreas.length > 0) {
            planHTML += `
                <div class="priority-section">
                    <h3>💪 Strength Maintenance (1-2 times/week)</h3>
                    ${analysis.strongAreas.map(area => `
                        <div class="habit-card priority-low">
                            <span class="habit-frequency">1-2x/week</span>
                            <h4>${area.subject} - ${area.topic}</h4>
                            <p>${this.getHabitForArea(area)}</p>
                            <small>Maintain excellence with light practice</small>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        planHTML += '</div>';
        return planHTML;
    }

    getHabitForArea(area) {
        const templates = HABIT_TEMPLATES[area.problemType] || HABIT_TEMPLATES.practice;
        const randomHabit = templates[Math.floor(Math.random() * templates.length)];
        return randomHabit.replace('{topic}', area.topic).replace('{subject}', area.subject);
    }

    generatePDF() {
        if (!this.subjects || this.subjects.length === 0) {
            alert('Please generate a study plan first');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set document properties
        doc.setProperties({
            title: 'Personalized Study Habit Plan',
            subject: 'Study Plan for Class 11/12',
            author: 'Study Habit Builder',
            keywords: 'study, habits, plan, education',
            creator: 'Study Habit Builder'
        });

        // Add header
        this.addHeader(doc);
        
        // Add analysis summary
        this.addAnalysisSummary(doc);
        
        // Add weekly plan
        this.addWeeklyPlan(doc);
        
        // Add study tips
        this.addStudyTips(doc);
        
        // Save the PDF
        const fileName = `Study_Habit_Plan_${new Date().toLocaleDateString('en-IN')}.pdf`;
        doc.save(fileName);
    }

    addHeader(doc) {
        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('📚 Personalized Study Habit Plan', 105, 20, { align: 'center' });
        
        // Subtitle
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Class 11/12 Academic Improvement Plan', 105, 28, { align: 'center' });
        
        // Generation date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}`, 105, 35, { align: 'center' });
        
        // Line separator
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 40, 190, 40);
    }

    addAnalysisSummary(doc) {
        const analysis = this.generateAnalysis();
        let yPosition = 50;
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text('Academic Performance Analysis', 20, yPosition);
        yPosition += 10;
        
        // Weak Areas
        if (analysis.weakAreas.length > 0) {
            yPosition = this.addPrioritySection(doc, '🚨 High Priority Areas', analysis.weakAreas, yPosition, [231, 76, 60]);
        }
        
        // Moderate Areas
        if (analysis.moderateAreas.length > 0) {
            yPosition = this.addPrioritySection(doc, '⚠️ Moderate Priority Areas', analysis.moderateAreas, yPosition, [243, 156, 18]);
        }
        
        // Strong Areas
        if (analysis.strongAreas.length > 0) {
            yPosition = this.addPrioritySection(doc, '✅ Strong Areas', analysis.strongAreas, yPosition, [39, 174, 96]);
        }
        
        return yPosition;
    }

    addPrioritySection(doc, title, areas, yPosition, color) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...color);
        doc.text(title, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        
        areas.forEach(area => {
            const text = `${area.subject} - ${area.topic}: ${area.marks}% (${area.problemType} focus)`;
            
            // Check if we need a new page
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.text(text, 25, yPosition);
            yPosition += 5;
        });
        
        yPosition += 8; // Extra space after section
        return yPosition;
    }

    addWeeklyPlan(doc) {
        doc.addPage(); // Start new page for weekly plan
        
        let yPosition = 20;
        const analysis = this.generateAnalysis();
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text('📅 Weekly Study Habit Plan', 20, yPosition);
        yPosition += 15;
        
        // High Priority Habits Table
        if (analysis.weakAreas.length > 0) {
            yPosition = this.addHabitsTable(doc, '🎯 Daily Habits (High Priority)', analysis.weakAreas, yPosition, 'Daily');
        }
        
        // Moderate Priority Habits Table
        if (analysis.moderateAreas.length > 0) {
            yPosition = this.addHabitsTable(doc, '📈 3-4 Times/Week (Moderate Priority)', analysis.moderateAreas, yPosition, '3-4x/week');
        }
        
        // Strong Areas Habits Table
        if (analysis.strongAreas.length > 0) {
            yPosition = this.addHabitsTable(doc, '💪 1-2 Times/Week (Maintenance)', analysis.strongAreas, yPosition, '1-2x/week');
        }
        
        // Add weekly schedule template
        yPosition = this.addWeeklySchedule(doc, yPosition);
    }

    addHabitsTable(doc, title, areas, yPosition, frequency) {
        // Check if we need a new page
        if (yPosition > 200) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text(title, 20, yPosition);
        yPosition += 8;
        
        const tableData = areas.map(area => [
            area.subject,
            area.topic,
            this.getHabitForArea(area),
            frequency,
            `${area.marks}% → ${this.getTarget(area.marks)}%`
        ]);
        
        doc.autoTable({
            startY: yPosition,
            head: [['Subject', 'Topic', 'Habit', 'Frequency', 'Target']],
            body: tableData,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [102, 126, 234], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 20, right: 20 }
        });
        
        return doc.lastAutoTable.finalY + 10;
    }

    addWeeklySchedule(doc, yPosition) {
        // Check if we need a new page
        if (yPosition > 150) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text('🗓️ Sample Weekly Schedule', 20, yPosition);
        yPosition += 8;
        
        const weeklySchedule = [
            ['Monday', 'High Priority Topics', '60 mins', 'Focus on weakest areas'],
            ['Tuesday', 'High + Moderate Topics', '90 mins', 'Mix of practice'],
            ['Wednesday', 'Moderate Topics', '60 mins', 'Building consistency'],
            ['Thursday', 'High Priority Topics', '90 mins', 'Deep practice'],
            ['Friday', 'All Topics Revision', '75 mins', 'Weekly review'],
            ['Saturday', 'Mock Test', '120 mins', 'Full subject test'],
            ['Sunday', 'Light Revision + Planning', '45 mins', 'Plan next week']
        ];
        
        doc.autoTable({
            startY: yPosition,
            head: [['Day', 'Focus', 'Duration', 'Notes']],
            body: weeklySchedule,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [155, 89, 182], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 20, right: 20 }
        });
        
        return doc.lastAutoTable.finalY + 10;
    }

    addStudyTips(doc) {
        doc.addPage(); // New page for study tips
        
        let yPosition = 20;
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text('💡 Effective Study Tips', 20, yPosition);
        yPosition += 15;
        
        const studyTips = [
            '🎯 Use Pomodoro Technique: 25min study + 5min break',
            '📝 Active Recall: Test yourself instead of re-reading',
            '🔄 Spaced Repetition: Review topics at increasing intervals',
            '📚 Interleaving: Mix different subjects/topics in one session',
            '✍️ Practice Writing: Especially for exam-oriented subjects',
            '📖 Understand Concepts: Don\'t just memorize formulas',
            '⏰ Consistent Timing: Study at the same time daily',
            '🎯 Clear Goals: Set specific targets for each session',
            '💤 Proper Sleep: 7-8 hours for better memory consolidation',
            '🏃 Physical Activity: 30min exercise for better focus',
            '🧘 Breaks are Important: Prevent burnout with proper breaks',
            '📊 Track Progress: Weekly review of what you\'ve learned'
        ];
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        
        studyTips.forEach(tip => {
            // Check if we need a new page
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.text('• ' + tip, 25, yPosition);
            yPosition += 6;
        });
        
        // Add final motivation
        yPosition += 10;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('🎉 You\'ve got this! Consistency is the key to success.', 105, yPosition, { align: 'center' });
    }

    getTarget(currentMarks) {
        if (currentMarks < 60) return 75;
        if (currentMarks < 80) return 90;
        return 95;
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StudyHabitBuilder();
});