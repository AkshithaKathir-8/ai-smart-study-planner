export function prepareAIContext({
subjects=[],
sessions=[],
events=[],
notes=[],
records=[]
}){


const cleanSubjects = subjects.map(subject=>({

name:subject.name,

code:subject.code || "",

examDate:subject.examDate || null

}));



const cleanSessions = sessions.map(session=>({

subject:session.subject,

topic:session.topic,

priority:session.priority,

duration:session.duration,

time:session.time,

status:session.status

}));




const cleanNotes = notes.map(note=>({

title:note.title,

description:note.description,

subject:note.subject || ""

}));




const cleanEvents = events.map(event=>({

title:event.title,

date:event.date,

description:event.description

}));




const cleanAttendance = records.map(record=>({

subject:record.subject,

attendance:
record.percentage || record.attendance

}));





return {

subjects:cleanSubjects,

studySessions:cleanSessions,

notes:cleanNotes,

upcomingEvents:cleanEvents,

attendance:cleanAttendance,


instruction:

`
Understand the difference between subject and topic.

Subject means the main course.

Topic means a chapter inside that subject.

Never combine them.

Prioritize:
1. Upcoming exams
2. Pending sessions
3. Low attendance subjects
4. Important notes

`

};


}