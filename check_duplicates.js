// Quick script to check for duplicates in house member data
const fs = require('fs');

// Parse the data from the user's message
const data = `AK
R 1
D 0
Nicholas Begich
District: At Large
Republican
Phone: (202) 225-5765
Office: 153 CHOB
View Full Profile →
AL
R 5
D 2
Robert Aderholt
District: At Large
Republican
Phone: (202) 225-4876
Office: 272 CHOB
View Full Profile →
Shomari Figures
District: At Large
Democrat
Phone: (202) 225-4931
Office: 225 CHOB
View Full Profile →
Barry Moore
District: At Large
Republican
Phone: (202) 225-2901
Office: 1511 LHOB
View Full Profile →
Gary Palmer
District: At Large
Republican
Phone: (202) 225-4921
Office: 170 CHOB
View Full Profile →
Mike Rogers
District: At Large
Republican
Phone: (202) 225-3261
Office: 2469 RHOB
View Full Profile →
Terri Sewell
District: At Large
Democrat
Phone: (202) 225-2665
Office: 1035 LHOB
View Full Profile →
Dale Strong
District: At Large
Republican
Phone: (202) 225-4801
Office: 449 CHOB
View Full Profile →`;

const lines = data.split('\n');
const members = [];
let currentState = '';
let currentMember = {};

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.length === 2 && line === line.toUpperCase()) {
        // State code
        currentState = line;
    } else if (line.includes('R ') || line.includes('D ')) {
        // Party counts, skip
    } else if (line && !line.includes('District:') && !line.includes('Phone:') && !line.includes('Office:') && !line.includes('View Full Profile') && !line.includes('Republican') && !line.includes('Democrat')) {
        // This is likely a name
        if (currentMember.name) {
            // Save previous member
            members.push({...currentMember});
        }
        currentMember = {
            name: line,
            state: currentState,
            party: '',
            phone: '',
            office: ''
        };
    } else if (line === 'Republican' || line === 'Democrat') {
        currentMember.party = line;
    } else if (line.startsWith('Phone:')) {
        currentMember.phone = line.replace('Phone: ', '');
    } else if (line.startsWith('Office:')) {
        currentMember.office = line.replace('Office: ', '');
    }
}

// Add the last member
if (currentMember.name) {
    members.push(currentMember);
}

console.log('Found', members.length, 'members');
console.log();

// Check for duplicate names
const nameCounts = {};
members.forEach(member => {
    nameCounts[member.name] = (nameCounts[member.name] || 0) + 1;
});

console.log('DUPLICATE NAMES:');
Object.entries(nameCounts).forEach(([name, count]) => {
    if (count > 1) {
        console.log(`"${name}" appears ${count} times`);
    }
});

// Check for duplicate phones
const phoneCounts = {};
members.forEach(member => {
    if (member.phone) {
        phoneCounts[member.phone] = (phoneCounts[member.phone] || 0) + 1;
    }
});

console.log('\nDUPLICATE PHONES:');
Object.entries(phoneCounts).forEach(([phone, count]) => {
    if (count > 1) {
        console.log(`"${phone}" appears ${count} times`);
    }
});

// Check for duplicate offices
const officeCounts = {};
members.forEach(member => {
    if (member.office) {
        officeCounts[member.office] = (officeCounts[member.office] || 0) + 1;
    }
});

console.log('\nDUPLICATE OFFICES:');
Object.entries(officeCounts).forEach(([office, count]) => {
    if (count > 1) {
        console.log(`"${office}" appears ${count} times`);
    }
});

console.log('\nALL MEMBERS:');
members.forEach((member, index) => {
    console.log(`${index + 1}. ${member.name} (${member.state}) - ${member.party} - ${member.phone} - ${member.office}`);
});