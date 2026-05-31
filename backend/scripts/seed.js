const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const InterviewExperience = require('../models/InterviewExperience');
const StudyRoom = require('../models/StudyRoom');
const RoomMessage = require('../models/RoomMessage');
const Comment = require('../models/Comment');
const Bookmark = require('../models/Bookmark');
const Vote = require('../models/Vote');

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interviewprep-hub');
    console.log('Connected. Cleaning database collections...');

    await User.deleteMany({});
    await InterviewExperience.deleteMany({});
    await StudyRoom.deleteMany({});
    await RoomMessage.deleteMany({});
    await Comment.deleteMany({});
    await Bookmark.deleteMany({});
    await Vote.deleteMany({});

    console.log('Creating Seed Users...');
    // Password hashing is handled by UserSchema.pre('save')
    const adminUser = await User.create({
      name: 'Admin Moderator',
      email: 'admin@prep.com',
      password: 'password123',
      role: 'admin',
      profile: {
        bio: 'Platform Moderator & System Admin.',
        githubUrl: 'https://github.com/admin',
        linkedinUrl: 'https://linkedin.com/in/admin',
        skills: ['Node.js', 'System Design', 'Security'],
        graduationYear: 2020
      }
    });

    const creatorUser = await User.create({
      name: 'Sarah Chen',
      email: 'creator@prep.com',
      password: 'password123',
      role: 'room_creator',
      profile: {
        bio: 'SWE @ Google. Tech Lead for Room Creators.',
        githubUrl: 'https://github.com/sarahchen',
        linkedinUrl: 'https://linkedin.com/in/sarahchen',
        skills: ['React', 'MongoDB', 'System Design'],
        graduationYear: 2022
      }
    });

    const standardUser = await User.create({
      name: 'Alex Johnson',
      email: 'user@prep.com',
      password: 'password123',
      role: 'user',
      profile: {
        bio: 'Final year CS student preparing for SDE-1 roles.',
        githubUrl: 'https://github.com/alexj',
        linkedinUrl: 'https://linkedin.com/in/alexj',
        skills: ['C++', 'DBMS', 'Data Structures'],
        graduationYear: 2027
      }
    });

    console.log('Users created.');

    console.log('Creating Sample Interview Experiences...');
    // Google Experience
    const exp1 = await InterviewExperience.create({
      companyName: 'Google',
      roleApplied: 'Software Engineering Intern',
      experienceLevel: 'Intern',
      difficulty: 'Medium',
      resultStatus: 'Selected',
      tipsResources: 'Practice Leetcode Medium & Hard. Focus on graphs, trees, and dynamic programming. For behavior rounds, read Google Culture tenets.',
      tags: ['SDE', 'Algorithms', 'Google', 'Graph'],
      questionsAsked: [
        'Find the longest path in a directed acyclic graph (DAG).',
        'Design a rate limiting system for API requests.'
      ],
      interviewRounds: [
        { roundName: 'Resume Screening', description: 'Basic screening of academic records and projects.', difficulty: 'Easy' },
        { roundName: 'Technical Round 1', description: 'Focus on trees and graph traversal. Had to implement in Java.', difficulty: 'Medium' },
        { roundName: 'Technical Round 2', description: 'Tough dynamic programming question about subsegment matches.', difficulty: 'Hard' }
      ],
      author: creatorUser._id,
      upvotesCount: 8,
      bookmarksCount: 3,
      commentsCount: 2
    });

    // Amazon Experience
    const exp2 = await InterviewExperience.create({
      companyName: 'Amazon',
      roleApplied: 'SDE-1',
      experienceLevel: 'Entry-Level',
      difficulty: 'Hard',
      resultStatus: 'Selected',
      tipsResources: 'Leadership Principles are 50% of the interview! Prepare 2 stories for each principle. Solve standard DFS, BFS, and Hashmap questions.',
      tags: ['SDE-1', 'Data Structures', 'Amazon', 'Leadership-Principles'],
      questionsAsked: [
        'Given a stream of words, find the top K most frequent elements in O(N log K) time.',
        'Implement an LRU Cache with O(1) set and get times.'
      ],
      interviewRounds: [
        { roundName: 'Online Assessment', description: '2 coding problems + code debugging + work style simulation.', difficulty: 'Medium' },
        { roundName: 'Technical Loop 1', description: 'Focused on algorithms and arrays. Followed by leadership questions.', difficulty: 'Medium' },
        { roundName: 'Technical Loop 2', description: 'System Architecture components and LRU design. Focus on performance.', difficulty: 'Hard' },
        { roundName: 'Bar Raiser Round', description: 'Deep dive into leadership principles. Questions about customer obsession.', difficulty: 'Hard' }
      ],
      author: standardUser._id,
      upvotesCount: 15,
      bookmarksCount: 6,
      commentsCount: 1
    });

    // Meta Experience
    const exp3 = await InterviewExperience.create({
      companyName: 'Meta',
      roleApplied: 'Frontend Engineer',
      experienceLevel: 'Mid-Level',
      difficulty: 'Hard',
      resultStatus: 'Rejected',
      tipsResources: 'Solve JavaScript DOM manipulation without libraries. Make sure you optimize performance and animations. Practice standard CSS flexbox/grid.',
      tags: ['Frontend', 'JavaScript', 'Meta', 'DOM-API'],
      questionsAsked: [
        'Build a progress bar that animates from 0 to 100% in N seconds. Add pause, start, and reset buttons.',
        'Implement a custom Javascript Promises framework from scratch (Promise.all, Promise.race).'
      ],
      interviewRounds: [
        { roundName: 'Screening Round', description: 'Short coding test checking JS closure and event loop knowledge.', difficulty: 'Medium' },
        { roundName: 'Frontend Coding 1', description: 'Interactive UI coding task using vanilla JS. Focus on efficiency.', difficulty: 'Hard' },
        { roundName: 'System Design', description: 'Design a web-scale newsfeed system with infinite scroll.', difficulty: 'Hard' }
      ],
      author: creatorUser._id,
      upvotesCount: 10,
      bookmarksCount: 4,
      commentsCount: 2
    });

    // Microsoft Experience
    const exp4 = await InterviewExperience.create({
      companyName: 'Microsoft',
      roleApplied: 'Program Manager-1',
      experienceLevel: 'Entry-Level',
      difficulty: 'Easy',
      resultStatus: 'Selected',
      tipsResources: 'Understand product design methodologies. Focus on user empathy, product-market fit, and technical feasibility.',
      tags: ['Product-Manager', 'Design', 'Microsoft'],
      questionsAsked: [
        'Design an alarm clock for blind people.',
        'How would you prioritize features for Microsoft Teams during a remote work boom?'
      ],
      interviewRounds: [
        { roundName: 'Group Discussion', description: 'Discussing a product failure scenario and suggesting remedies.', difficulty: 'Easy' },
        { roundName: 'Product Design', description: 'Whiteboarding alarm clock design features and customer feedback mechanisms.', difficulty: 'Easy' },
        { roundName: 'Technical Feasibility', description: 'Discussion with Engineering lead about feature implementation risks.', difficulty: 'Medium' }
      ],
      author: standardUser._id,
      upvotesCount: 5,
      bookmarksCount: 2,
      commentsCount: 0
    });

    console.log('Experiences created.');

    console.log('Creating Comments...');
    await Comment.create({
      experience: exp1._id,
      author: standardUser._id,
      content: 'This is super helpful! How deep did they go into rate limit algorithms (Leaky bucket vs Token bucket)?'
    });

    await Comment.create({
      experience: exp1._id,
      author: creatorUser._id,
      content: 'They asked me to explain the trade-offs of both! Make sure you know Token Bucket allows bursts while Leaky Bucket smooths traffic.'
    });

    await Comment.create({
      experience: exp2._id,
      author: adminUser._id,
      content: 'Congrats on the offer! Amazon Bar Raiser rounds are famously tough.'
    });

    await Comment.create({
      experience: exp3._id,
      author: standardUser._id,
      content: 'Sorry to hear about the rejection, but thanks for detailing the DOM requirements. Vanilla JS is definitely underrated.'
    });

    await Comment.create({
      experience: exp3._id,
      author: creatorUser._id,
      content: 'Yeah, I struggled with throttle/debounce edge cases. Highly recommend practicing standard utility polyfills.'
    });

    console.log('Comments created.');

    console.log('Creating Votes & Bookmarks...');
    // Votes
    await Vote.create({ user: standardUser._id, experience: exp1._id });
    await Vote.create({ user: adminUser._id, experience: exp1._id });
    await Vote.create({ user: creatorUser._id, experience: exp2._id });
    await Vote.create({ user: adminUser._id, experience: exp2._id });
    await Vote.create({ user: standardUser._id, experience: exp3._id });

    // Bookmarks
    await Bookmark.create({ user: standardUser._id, experience: exp1._id });
    await Bookmark.create({ user: standardUser._id, experience: exp2._id });
    await Bookmark.create({ user: creatorUser._id, experience: exp2._id });

    console.log('Votes & Bookmarks created.');

    console.log('Creating Study Rooms...');
    const rooms = [
      {
        name: 'MERN Interview Prep',
        description: 'Prepare for Node.js, Express, MongoDB, and React interviews together. Code reviews and mock assessments.',
        creator: creatorUser._id,
      },
      {
        name: 'MongoDB Mastery',
        description: 'Dive deep into document indexing, schema design patterns, aggregation frameworks, and cluster scaling.',
        creator: creatorUser._id,
      },
      {
        name: 'Node.js Crash Course',
        description: 'Discussion of Event Loops, Streams, Buffers, Worker Threads, clustering, and asynchronous paradigms.',
        creator: creatorUser._id,
      },
      {
        name: 'System Design Discussion',
        description: 'Architecting large-scale systems (like Netflix, Uber, TinyURL) under high load. CAP theorem, caching, load balancing.',
        creator: adminUser._id,
      },
      {
        name: 'DBMS Revision',
        description: 'Reviewing SQL joins, transactions, ACID properties, normalization forms, indexes, and locking schemas.',
        creator: standardUser._id,
      }
    ];

    const seededRooms = [];
    for (const r of rooms) {
      const roomObj = await StudyRoom.create({
        ...r,
        members: [r.creator, adminUser._id, standardUser._id, creatorUser._id].filter(
          (val, idx, self) => self.indexOf(val) === idx // Unique members
        ),
      });
      roomObj.memberCount = roomObj.members.length;
      await roomObj.save();
      seededRooms.push(roomObj);
    }

    console.log('Study Rooms created.');

    console.log('Creating Study Room Messages/Discussion Threads...');
    // MERN Prep messages
    const r1 = seededRooms[0];
    await RoomMessage.create({
      room: r1._id,
      author: standardUser._id,
      content: 'Hey everyone, starting my MERN prep! Does anyone have a good reference for React fiber and reconciliation?',
      likes: [creatorUser._id, adminUser._id],
      likesCount: 2
    });

    await RoomMessage.create({
      room: r1._id,
      author: creatorUser._id,
      content: 'Welcome! Read the official React docs on virtual DOM reconciliation. Key concepts are keys (identity), child list diffs, and fiber fiber-node state lists.',
      likes: [standardUser._id],
      likesCount: 1
    });

    await RoomMessage.create({
      room: r1._id,
      author: adminUser._id,
      content: 'Also make sure you understand the difference between client-side rendering (Vite) and server-side rendering (Next.js). They ask that a lot in SDE-1 interviews.',
      likesCount: 0
    });

    // System Design messages
    const r4 = seededRooms[3];
    await RoomMessage.create({
      room: r4._id,
      author: creatorUser._id,
      content: 'What database should we choose for designing an Uber clone? PostgreSQL (PostGIS extension) or MongoDB?',
      likes: [adminUser._id],
      likesCount: 1
    });

    await RoomMessage.create({
      room: r4._id,
      author: adminUser._id,
      content: 'For location coordinates tracking, PostgreSQL with PostGIS is highly efficient for geo-spatial spatial queries. MongoDB also has great 2dsphere indexes, but relational consistency helps with rider-driver payments matching.',
      likes: [creatorUser._id, standardUser._id],
      likesCount: 2
    });

    console.log('Study Room messages created.');
    console.log('Database seeding successfully finished!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
