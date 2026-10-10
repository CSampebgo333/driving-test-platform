/*
 * Question bank. Edit freely — keep this exact shape:
 * { id, question, options: [4 strings], correctIndex: 0-3, explanation }
 */
const QUESTIONS = [
  {
    id: 1,
    question: "What does an amber (yellow) traffic light mean?",
    options: [
      "Speed up to beat the red",
      "Stop, unless it is unsafe to do so",
      "The light is broken — proceed with caution",
      "Go, but sound your horn"
    ],
    correctIndex: 1,
    explanation: "Amber means prepare to stop. You should stop unless you are already so close to the line that stopping would be unsafe."
  },
  {
    id: 2,
    question: "Which category of road sign is designed to warn you of a hazard ahead, such as a sharp bend or a slippery road?",
    options: [
      "Regulatory signs",
      "Informational signs",
      "Warning signs",
      "Advertising signs"
    ],
    correctIndex: 2,
    explanation: "Road signs fall into three broad groups: regulatory signs tell you what you must or must not do, warning signs alert you to hazards so you can adjust early, and informational signs help you find your way or locate services."
  },
  {
    id: 3,
    question: "You reach a junction with no signs, signals or markings to say who has priority. What is the safest approach?",
    options: [
      "Slow down, be ready to stop, and give way to anyone already in the junction or who clearly has priority",
      "Speed up so you clear the junction before other drivers arrive",
      "Sound your horn and continue without slowing",
      "Follow the vehicle in front without looking"
    ],
    correctIndex: 0,
    explanation: "When priority is unclear, never assume you have it. Slowing down gives you time to look, judge other road users' speed and intentions, and stop if needed. Yielding to anyone already in the junction avoids most collisions."
  },
  {
    id: 4,
    question: "A pedestrian is waiting at the edge of a marked crossing as you approach. What should you do?",
    options: [
      "Sound your horn so they know you are coming",
      "Speed up to pass before they step out",
      "Flash your headlights and keep going",
      "Slow down, be ready to stop, and let them cross safely"
    ],
    correctIndex: 3,
    explanation: "Crossings exist to protect people on foot, who are far more vulnerable than people in vehicles. Slowing early shows your intention and leaves room to stop smoothly, and you should never overtake near a crossing."
  },
  {
    id: 5,
    question: "Why is it recommended to keep at least a two-second gap behind the vehicle in front in good conditions?",
    options: [
      "It saves a little fuel and nothing else",
      "It gives you time to notice and react if the vehicle ahead brakes suddenly",
      "It lets other drivers overtake you more easily",
      "It is only needed on busy roads"
    ],
    correctIndex: 1,
    explanation: "Your reaction time plus braking distance must fit inside the gap you leave. The two-second rule is a simple way to check it: when the vehicle ahead passes a fixed object, you should not reach it for at least two seconds. Allow more time in rain, fog, or on icy roads."
  },
  {
    id: 6,
    question: "Before overtaking another vehicle, what must you be sure of?",
    options: [
      "That the other driver will speed up to help you",
      "That the vehicle ahead is travelling slowly",
      "That you can see far enough ahead to finish the pass and return to your lane safely",
      "That your horn is working"
    ],
    correctIndex: 2,
    explanation: "An overtake takes longer and needs more distance than most people expect. Only pass when the road ahead is clear, you are allowed to, and there is room to move back in safely. If in doubt, stay back and wait."
  },
  {
    id: 7,
    question: "Who should wear a seatbelt in a moving car?",
    options: [
      "Only the driver",
      "Only the people in the front seats",
      "Only passengers on long journeys",
      "Everyone in the vehicle, in every seat that has a belt"
    ],
    correctIndex: 3,
    explanation: "Seatbelts are required by law in most places, and for good reason: in a crash they keep you in your seat and spread the force across the strongest parts of your body. An unbelted rear passenger can also seriously injure people in front of them."
  },
  {
    id: 8,
    question: "Why is using a handheld phone while driving dangerous?",
    options: [
      "It takes your eyes, hands and attention off the road, so you react to hazards more slowly",
      "It only matters if you are also speeding",
      "It is only a risk in heavy traffic",
      "It is safe as long as you only glance at the screen"
    ],
    correctIndex: 0,
    explanation: "Driving needs your eyes, hands and full attention. Even a short glance at a screen means travelling a long distance without looking at the road. Hands-free calls can still distract you, so if you must use a phone, park somewhere safe first."
  },
  {
    id: 9,
    question: "How does alcohol affect your ability to drive?",
    options: [
      "It sharpens your focus once you've had a short rest",
      "It affects balance only, not driving",
      "It slows your reactions, weakens judgment and coordination, and can make you overconfident",
      "Strong coffee cancels out the effects"
    ],
    correctIndex: 2,
    explanation: "Alcohol slows your reaction time, blurs your judgment of speed and distance, and makes you feel more capable than you are. Only time removes it from your body. The safest rule is simple: if you are going to drive, don't drink."
  },
  {
    id: 10,
    question: "A ball rolls into the road ahead from between parked cars. What should you do first?",
    options: [
      "Keep your speed — a ball is not a danger",
      "Slow down and be ready to stop, because a child may follow it",
      "Swerve around the ball without braking",
      "Sound your horn and speed up"
    ],
    correctIndex: 1,
    explanation: "Hazard perception means thinking about what might happen next. A ball in the road often means someone is about to run out after it, so reduce your speed immediately and cover the brake."
  }
];
