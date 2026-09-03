/**
 * Seeds the learning content the course generator and quiz engine need:
 * exam target codes, per-exam subjects, topics, questions + answer options,
 * quizzes, mock exams, and preparation papers.
 *
 * Safe to re-run: every write is an upsert or a guarded create, keyed on the
 * natural unique constraints already in the schema (exam name, subject
 * [examId, subjectName], topic [subjectId, topicName], quiz question
 * [quizId, questionId], ...). Existing rows authored by admins are never
 * deleted — this only fills gaps.
 *
 * Run with: node prisma/seedContent.js
 */
import { prisma } from "../src/config/prisma.js";

// The frontend offers these four target keys; targetCode is what the course
// generator resolves against, so an exam is matched by a stable string rather
// than a hardcoded row id that shifts between environments.
const EXAM_TARGETS = [
  { targetCode: "pttc", examName: "គ្រូបឋម", examType: "គ្រូបឋម", label: "Primary school teacher" },
  { targetCode: "rttc", examName: "គ្រូអនុវិទ្យាល័យ", examType: "គ្រូអនុវិទ្យាល័យ", label: "Lower-secondary teacher" },
  { targetCode: "nie", examName: "គ្រូវិទ្យាល័យ", examType: "គ្រូវិទ្យាល័យ", label: "Upper-secondary (high school) teacher" },
  { targetCode: "kindergarten", examName: "គ្រូមត្តេយ្យ", examType: "គ្រូមត្តេយ្យ", label: "Kindergarten teacher" },
];

const SUBJECT_BLUEPRINT = [
  {
    subjectName: "គណិតវិទ្យា",
    topics: ["ប្រភាគ និងទសភាគ", "សមីការដឺក្រេទី១", "ធរណីមាត្រមូលដ្ឋាន", "ស្ថិតិ និងប្រូបាប"],
  },
  {
    subjectName: "ភាសាខ្មែរ",
    topics: ["វេយ្យាករណ៍ខ្មែរ", "អក្ខរាវិរុទ្ធ", "អត្ថបទ និងការសរសេរ", "អក្សរសាស្ត្រខ្មែរ"],
  },
  {
    subjectName: "វប្បធម៌ទូទៅ",
    topics: ["ប្រវត្តិសាស្ត្រកម្ពុជា", "ភូមិសាស្ត្រកម្ពុជា", "ពលរដ្ឋវិជ្ជា", "ព្រឹត្តិការណ៍បច្ចុប្បន្ន"],
  },
  {
    subjectName: "គរុកោសល្យ",
    topics: ["វិធីសាស្ត្របង្រៀន", "ចិត្តវិទ្យាសិក្សា", "ការវាយតម្លៃសិស្ស", "ការគ្រប់គ្រងថ្នាក់រៀន"],
  },
];

/**
 * Question banks written per topic so the seeded content is factually sound
 * rather than auto-generated filler. Each entry: [questionText, options[],
 * correctIndex, explanation]. Kept deliberately basic — this is placeholder
 * content meant to exercise the pipeline until real questions are authored.
 */
const QUESTION_BANK = {
  "ប្រភាគ និងទសភាគ": [
    ["១/២ + １/៤ ស្មើនឹងប៉ុន្មាន?", ["៣/៤", "១/៦", "២/៦", "១/៨"], 0, "១/២ = ២/៤ ដូច្នេះ ២/៤ + ១/៤ = ៣/៤។"],
    ["០.២៥ ជាប្រភាគស្មើនឹង?", ["១/៤", "១/២", "២/៥", "១/៣"], 0, "០.២៥ = ២៥/១០០ = ១/៤។"],
    ["៣/៥ គុណនឹង ១០ ស្មើនឹង?", ["៦", "៥", "៨", "៣"], 0, "៣/៥ × ១០ = ៣០/៥ = ៦។"],
    ["តើប្រភាគណាធំជាងគេ?", ["៣/៤", "២/៣", "១/២", "៥/៨"], 0, "៣/៤ = ០.៧៥ ធំជាង ២/៣ ≈ ០.៦៧។"],
  ],
  "សមីការដឺក្រេទី១": [
    ["ដោះស្រាយ: x + ៥ = ១២", ["x = ៧", "x = ១៧", "x = ៥", "x = ៦"], 0, "x = ១២ − ៥ = ៧។"],
    ["ដោះស្រាយ: ២x = ១៤", ["x = ៧", "x = ២៨", "x = ១២", "x = ៦"], 0, "x = ១៤ ÷ ២ = ៧។"],
    ["ដោះស្រាយ: ៣x − ៦ = ៩", ["x = ៥", "x = ១", "x = ៣", "x = ១៥"], 0, "៣x = ១៥ ដូច្នេះ x = ៥។"],
    ["បើ x = ៤ តើ ២x + ៣ ស្មើប៉ុន្មាន?", ["១១", "៨", "១៤", "៧"], 0, "២(៤) + ៣ = ១១។"],
  ],
  "ធរណីមាត្រមូលដ្ឋាន": [
    ["ផលបូកមុំក្នុងត្រីកោណស្មើនឹង?", ["១៨០°", "៣៦០°", "៩០°", "២៧០°"], 0, "ផលបូកមុំក្នុងត្រីកោណតែងតែស្មើ ១៨០°។"],
    ["ក្រឡាផ្ទៃចតុកោណកែងគណនាដោយ?", ["បណ្តោយ × ទទឹង", "បណ្តោយ + ទទឹង", "២(បណ្តោយ + ទទឹង)", "បណ្តោយ ÷ ទទឹង"], 0, "ក្រឡាផ្ទៃ = បណ្តោយ គុណ ទទឹង។"],
    ["រង្វង់មានមុំកណ្តាលសរុបប៉ុន្មាន?", ["៣៦០°", "១៨០°", "៩០°", "២៤០°"], 0, "រង្វង់ពេញមាន ៣៦០ ដឺក្រេ។"],
    ["ត្រីកោណសម័ង្សមានជ្រុងប៉ុន្មានស្មើគ្នា?", ["៣", "២", "១", "០"], 0, "ត្រីកោណសម័ង្សមានជ្រុងទាំង ៣ ស្មើគ្នា។"],
  ],
  "ស្ថិតិ និងប្រូបាប": [
    ["មធ្យមភាគនៃ ២, ៤, ៦ ស្មើនឹង?", ["៤", "៦", "៣", "១២"], 0, "(២+៤+៦) ÷ ៣ = ៤។"],
    ["ប្រូបាបនៃការបោះកាក់ចេញផ្នែកមុខ?", ["១/២", "១/៣", "១/៤", "១"], 0, "កាក់មាន ២ ផ្នែក ដូច្នេះប្រូបាប = ១/២។"],
    ["មេដ្យាននៃ ១, ៣, ៥, ៧, ９ គឺ?", ["៥", "៣", "៧", "១"], 0, "តម្លៃកណ្តាលនៃលេខតម្រៀបគឺ ៥។"],
    ["ប្រូបាបមានតម្លៃចន្លោះ?", ["០ និង ១", "−១ និង ១", "០ និង ១០០", "១ និង ១០"], 0, "ប្រូបាបតែងតែស្ថិតចន្លោះ ០ និង ១។"],
  ],
  "វេយ្យាករណ៍ខ្មែរ": [
    ["ពាក្យណាជានាម?", ["សាលា", "រត់", "ស្អាត", "ណាស់"], 0, "«សាលា» ជានាមព្រោះវាតំណាងឲ្យវត្ថុ/កន្លែង។"],
    ["ពាក្យណាជាកិរិយាសព្ទ?", ["ដើរ", "ផ្ទះ", "ក្រហម", "ខ្ពស់"], 0, "«ដើរ» បង្ហាញពីសកម្មភាព ដូច្នេះជាកិរិយាសព្ទ។"],
    ["ពាក្យណាជាគុណនាម?", ["ស្រស់ស្អាត", "សៀវភៅ", "សរសេរ", "គ្រូ"], 0, "«ស្រស់ស្អាត» ពិពណ៌នាលក្ខណៈ ដូច្នេះជាគុណនាម។"],
    ["ប្រយោគពេញលេញត្រូវមាន?", ["ប្រធាន និងកិរិយា", "នាមតែមួយ", "គុណនាមតែមួយ", "ឧទានសព្ទ"], 0, "ប្រយោគពេញលេញត្រូវមានប្រធាន និងកិរិយា។"],
  ],
  "អក្ខរាវិរុទ្ធ": [
    ["ព្យញ្ជនៈខ្មែរមានប៉ុន្មានតួ?", ["៣៣", "២៣", "៤៣", "៣០"], 0, "អក្សរខ្មែរមានព្យញ្ជនៈ ៣៣ តួ។"],
    ["ស្រៈនិស្ស័យប្រើជាមួយ?", ["ព្យញ្ជនៈ", "លេខ", "សញ្ញា", "ចន្លោះ"], 0, "ស្រៈនិស្ស័យត្រូវសរសេរភ្ជាប់ជាមួយព្យញ្ជនៈ។"],
    ["ជើងអក្សរប្រើសម្រាប់?", ["ផ្សំព្យញ្ជនៈ", "បំបែកពាក្យ", "បញ្ចប់ប្រយោគ", "សរសេរលេខ"], 0, "ជើងអក្សរប្រើដើម្បីផ្សំព្យញ្ជនៈពីរ។"],
    ["សញ្ញា «។» ហៅថា?", ["ខណ្ឌ", "សួរ", "ឧទាន", "ក្បៀស"], 0, "«។» គឺជាសញ្ញាខណ្ឌ សម្រាប់បញ្ចប់ប្រយោគ។"],
  ],
  "អត្ថបទ និងការសរសេរ": [
    ["កថាខណ្ឌល្អគួរមានប៉ុន្មានគំនិតចម្បង?", ["មួយ", "បី", "ប្រាំ", "គ្មាន"], 0, "កថាខណ្ឌល្អផ្តោតលើគំនិតចម្បងតែមួយ។"],
    ["ផ្នែកណាមកមុនក្នុងអត្ថបទ?", ["សេចក្តីផ្តើម", "សេចក្តីសន្និដ្ឋាន", "តួអត្ថបទ", "ឯកសារយោង"], 0, "អត្ថបទចាប់ផ្តើមដោយសេចក្តីផ្តើម។"],
    ["ការសង្ខេបត្រូវ?", ["ខ្លីជាងអត្ថបទដើម", "វែងជាងអត្ថបទដើម", "ដូចគ្នាបេះបិទ", "គ្មានទំនាក់ទំនង"], 0, "ការសង្ខេបត្រូវខ្លីជាង ប៉ុន្តែរក្សាខ្លឹមសារសំខាន់។"],
    ["សេចក្តីសន្និដ្ឋានប្រើសម្រាប់?", ["សរុបខ្លឹមសារ", "បន្ថែមទិន្នន័យថ្មី", "ចាប់ផ្តើមប្រធានបទ", "រាយឈ្មោះ"], 0, "សេចក្តីសន្និដ្ឋានសរុបនូវអ្វីដែលបានបង្ហាញ។"],
  ],
  "អក្សរសាស្ត្រខ្មែរ": [
    ["«ទុំទាវ» ជាប្រភេទអ្វី?", ["រឿងព្រេង", "សៀវភៅវិទ្យាសាស្ត្រ", "កំណត់ហេតុ", "វចនានុក្រម"], 0, "ទុំទាវជាអក្សរសាស្ត្រ/រឿងព្រេងខ្មែរដ៏ល្បី។"],
    ["ច្បាប់ស្រីជាឯកសារប្រភេទ?", ["អប់រំសីលធម៌", "គណិតវិទ្យា", "ភូមិសាស្ត្រ", "រូបវិទ្យា"], 0, "ច្បាប់ជាអក្សរសិល្ប៍អប់រំសីលធម៌។"],
    ["កំណាព្យខ្មែរផ្តោតលើ?", ["ចង្វាក់ និងសម្ផស្ស", "លេខនព្វន្ត", "ផែនទី", "ពិសោធន៍"], 0, "កំណាព្យផ្តោតលើចង្វាក់ និងសម្ផស្សនៃពាក្យ។"],
    ["អក្សរសាស្ត្រជួយអភិវឌ្ឍ?", ["ភាសា និងគំនិត", "កម្លាំងរាងកាយ", "ល្បឿនរត់", "ចំណេះជាងឈើ"], 0, "អក្សរសាស្ត្រអភិវឌ្ឍជំនាញភាសា និងការគិត។"],
  ],
  "ប្រវត្តិសាស្ត្រកម្ពុជា": [
    ["ប្រាសាទអង្គរវត្តស្ថិតក្នុងខេត្តណា?", ["សៀមរាប", "បាត់ដំបង", "កំពត", "ក្រចេះ"], 0, "អង្គរវត្តស្ថិតនៅខេត្តសៀមរាប។"],
    ["អង្គរវត្តសាងសង់ក្នុងសតវត្សទី?", ["១២", "១៦", "៩", "១៩"], 0, "អង្គរវត្តសាងសង់នៅសតវត្សទី១២។"],
    ["កម្ពុជាទទួលឯករាជ្យពីបារាំងឆ្នាំ?", ["១៩៥៣", "១៩៧៥", "១៩៧៩", "១៩៩៣"], 0, "កម្ពុជាទទួលឯករាជ្យពេញលេញនៅឆ្នាំ១៩៥៣។"],
    ["រាជធានីបច្ចុប្បន្ននៃកម្ពុជា?", ["ភ្នំពេញ", "សៀមរាប", "បាត់ដំបង", "ព្រះសីហនុ"], 0, "ភ្នំពេញជារាជធានីនៃកម្ពុជា។"],
  ],
  "ភូមិសាស្ត្រកម្ពុជា": [
    ["បឹងធំជាងគេនៅកម្ពុជា?", ["ទន្លេសាប", "បឹងយក្សឡោម", "បឹងកក់", "បឹងស្នួល"], 0, "ទន្លេសាបជាបឹងទឹកសាបធំជាងគេ។"],
    ["ទន្លេធំជាងគេហូរកាត់កម្ពុជា?", ["មេគង្គ", "សេសាន", "សេកុង", "ស្ទឹងសែន"], 0, "ទន្លេមេគង្គជាទន្លេធំជាងគេ។"],
    ["កម្ពុជាមានប៉ុន្មានរដូវក្នុងមួយឆ្នាំ?", ["២", "៤", "៣", "១"], 0, "កម្ពុជាមានរដូវវស្សា និងរដូវប្រាំង។"],
    ["ខេត្តណាមានច្រកចេញសមុទ្រ?", ["ព្រះសីហនុ", "កំពង់ចាម", "សៀមរាប", "ត្បូងឃ្មុំ"], 0, "ខេត្តព្រះសីហនុមានឆ្នេរសមុទ្រ។"],
  ],
  "ពលរដ្ឋវិជ្ជា": [
    ["ច្បាប់កំពូលនៃប្រទេស?", ["រដ្ឋធម្មនុញ្ញ", "អនុក្រឹត្យ", "សេចក្តីណែនាំ", "ប្រកាស"], 0, "រដ្ឋធម្មនុញ្ញជាច្បាប់កំពូល។"],
    ["សិទ្ធិទទួលបានការអប់រំជាសិទ្ធិ?", ["មូលដ្ឋាន", "ពិសេស", "បណ្តោះអាសន្ន", "លក្ខខណ្ឌ"], 0, "ការអប់រំជាសិទ្ធិមូលដ្ឋានរបស់ពលរដ្ឋ។"],
    ["ភារកិច្ចពលរដ្ឋរួមមាន?", ["គោរពច្បាប់", "បំពានច្បាប់", "គេចពន្ធ", "បំផ្លាញសម្បត្តិ"], 0, "ពលរដ្ឋមានភារកិច្ចគោរពច្បាប់។"],
    ["ការបោះឆ្នោតជា?", ["សិទ្ធិពលរដ្ឋ", "ការបង្ខិតបង្ខំ", "ជម្រើសរបស់រដ្ឋ", "ការលេងសើច"], 0, "ការបោះឆ្នោតជាសិទ្ធិរបស់ពលរដ្ឋ។"],
  ],
  "ព្រឹត្តិការណ៍បច្ចុប្បន្ន": [
    ["អាស៊ានមានសមាជិកប៉ុន្មានប្រទេស?", ["១០", "៨", "១២", "១៥"], 0, "អាស៊ានមានសមាជិក ១០ ប្រទេស។"],
    ["អង្គការសហប្រជាជាតិសរសេរកាត់?", ["UN", "EU", "WHO", "IMF"], 0, "United Nations សរសេរកាត់ថា UN។"],
    ["ការប្រែប្រួលអាកាសធាតុបណ្តាលមកពី?", ["ឧស្ម័នផ្ទះកញ្ចក់", "ការដាំដើមឈើ", "ការសន្សំថាមពល", "ការកាត់បន្ថយសំណល់"], 0, "ឧស្ម័នផ្ទះកញ្ចក់ជាមូលហេតុចម្បង។"],
    ["បច្ចេកវិទ្យា AI តំណាងឲ្យ?", ["បញ្ញាសិប្បនិមិត្ត", "អុីនធឺណិត", "ទូរស័ព្ទ", "កុំព្យូទ័រ"], 0, "AI = Artificial Intelligence = បញ្ញាសិប្បនិមិត្ត។"],
  ],
  "វិធីសាស្ត្របង្រៀន": [
    ["វិធីសាស្ត្រផ្តោតលើសិស្សហៅថា?", ["សិស្សមជ្ឈមណ្ឌល", "គ្រូមជ្ឈមណ្ឌល", "សៀវភៅមជ្ឈមណ្ឌល", "ការប្រឡងមជ្ឈមណ្ឌល"], 0, "វិធីសាស្ត្រនេះឲ្យសិស្សចូលរួមសកម្ម។"],
    ["ការងារជាក្រុមជួយសិស្ស?", ["សហការ និងទំនាក់ទំនង", "ធ្វើការតែម្នាក់ឯង", "ចម្លងចម្លើយ", "ស្ងាត់គ្រប់ពេល"], 0, "ការងារជាក្រុមអភិវឌ្ឍជំនាញសហការ។"],
    ["សម្ភារឧបទ្ទេសជួយ?", ["បង្កើនការយល់ដឹង", "បង្កើនពេលវេលា", "កាត់បន្ថយសិស្ស", "លុបមេរៀន"], 0, "សម្ភារឧបទ្ទេសធ្វើឲ្យមេរៀនងាយយល់។"],
    ["ផែនការបង្រៀនត្រូវមាន?", ["គោលបំណងច្បាស់លាស់", "តែចំណងជើង", "តែថ្ងៃខែ", "គ្មានរចនាសម្ព័ន្ធ"], 0, "ផែនការបង្រៀនចាំបាច់ត្រូវមានគោលបំណងច្បាស់លាស់។"],
  ],
  "ចិត្តវិទ្យាសិក្សា": [
    ["ការលើកទឹកចិត្តខាងក្នុងកើតចេញពី?", ["ចំណាប់អារម្មណ៍ផ្ទាល់ខ្លួន", "រង្វាន់ជាប្រាក់", "ការដាក់ទោស", "សម្ពាធពីគ្រូ"], 0, "ការលើកទឹកចិត្តខាងក្នុងមកពីចំណាប់អារម្មណ៍ផ្ទាល់ខ្លួន។"],
    ["កុមារសិក្សាបានល្អបំផុតនៅពេល?", ["មានអារម្មណ៍សុវត្ថិភាព", "មានការភ័យខ្លាច", "អត់ដំណេក", "ឃ្លាន"], 0, "បរិយាកាសសុវត្ថិភាពជួយឲ្យការសិក្សាកាន់តែល្អ។"],
    ["ការចងចាំរយៈពេលវែងពង្រឹងដោយ?", ["ការរំលឹកម្តងហើយម្តងទៀត", "ការអានតែម្តង", "ការភ្លេច", "ការប្រញាប់"], 0, "ការរំលឹកម្តងទៀតជួយផ្ទេរទៅការចងចាំរយៈពេលវែង។"],
    ["ភាពខុសគ្នារវាងសិស្សត្រូវ?", ["គោរព និងសម្របតាម", "មិនអើពើ", "ដាក់ទោស", "លុបបំបាត់"], 0, "គ្រូគួរសម្របវិធីបង្រៀនតាមភាពខុសគ្នារបស់សិស្ស។"],
  ],
  "ការវាយតម្លៃសិស្ស": [
    ["ការវាយតម្លៃបង្កើតគោលបំណងដើម្បី?", ["កែលម្អការរៀន", "ដាក់ទោសសិស្ស", "តម្រៀបចំណាត់ថ្នាក់តែប៉ុណ្ណោះ", "បំពេញឯកសារ"], 0, "ការវាយតម្លៃមានគោលបំណងកែលម្អការរៀនសូត្រ។"],
    ["ការវាយតម្លៃបន្តបន្ទាប់ធ្វើឡើងនៅពេល?", ["ក្នុងអំឡុងពេលរៀន", "តែពេលចប់ឆ្នាំ", "មុនចូលរៀន", "គ្មានពេលកំណត់"], 0, "ការវាយតម្លៃបន្តធ្វើឡើងក្នុងអំឡុងដំណើរការសិក្សា។"],
    ["មតិយោបល់ល្អគួរ?", ["ជាក់លាក់ និងស្ថាបនា", "ទូទៅ និងអវិជ្ជមាន", "គ្មានការពន្យល់", "យឺតយ៉ាវ"], 0, "មតិយោបល់គួរជាក់លាក់ និងជួយសិស្សកែលម្អ។"],
    ["តេស្តល្អត្រូវវាស់?", ["អ្វីដែលបានបង្រៀន", "អ្វីដែលមិនបានរៀន", "ល្បឿនសរសេរ", "ភាពស្អាតនៃអក្សរ"], 0, "តេស្តត្រូវឆ្លុះបញ្ចាំងខ្លឹមសារដែលបានបង្រៀន។"],
  ],
  "ការគ្រប់គ្រងថ្នាក់រៀន": [
    ["វិន័យថ្នាក់រៀនល្អផ្អែកលើ?", ["ច្បាប់ច្បាស់លាស់ និងស្មើភាព", "ការស្រែក", "ការដាក់ទោសធ្ងន់", "ការមិនអើពើ"], 0, "ច្បាប់ច្បាស់លាស់ និងអនុវត្តស្មើភាពជួយគ្រប់គ្រងថ្នាក់។"],
    ["ការរៀបចំកៅអីជាក្រុមជួយ?", ["ការពិភាក្សា", "ការស្ងាត់", "ការប្រឡង", "ការដេក"], 0, "ការរៀបចំជាក្រុមជំរុញការពិភាក្សា។"],
    ["នៅពេលសិស្សរំខាន គ្រូគួរ?", ["ដោះស្រាយដោយស្ងប់ស្ងាត់", "ស្រែកដាក់", "បណ្តេញភ្លាម", "មិនអើពើ"], 0, "ការដោះស្រាយដោយស្ងប់ស្ងាត់មានប្រសិទ្ធភាពជាងគេ។"],
    ["ពេលវេលាបង្រៀនប្រើប្រាស់ល្អបំផុតនៅពេល?", ["រៀបចំផែនការទុកមុន", "គ្មានផែនការ", "ពន្យាពេល", "និយាយក្រៅមេរៀន"], 0, "ការរៀបចំផែនការជួយប្រើពេលវេលាឲ្យមានប្រសិទ្ធភាព។"],
  ],
};

async function upsertExams() {
  const exams = [];
  for (const target of EXAM_TARGETS) {
    const existing = await prisma.exam.findFirst({ where: { examName: target.examName } });
    const exam = existing
      ? await prisma.exam.update({
          where: { examId: existing.examId },
          data: { targetCode: target.targetCode, examType: target.examType, description: target.label },
        })
      : await prisma.exam.create({
          data: {
            examName: target.examName,
            examType: target.examType,
            targetCode: target.targetCode,
            description: target.label,
          },
        });
    exams.push(exam);
  }
  return exams;
}

async function upsertSubjectsAndTopics(exam) {
  const created = { subjects: 0, topics: 0 };
  const subjects = [];

  for (const blueprint of SUBJECT_BLUEPRINT) {
    let subject = await prisma.subject.findFirst({
      where: { examId: exam.examId, subjectName: blueprint.subjectName },
    });

    if (!subject) {
      // Adopt an orphaned subject (examId null) of the same name before
      // creating a duplicate — the DB shipped with a few unlinked subjects
      // that papers already point at, and re-pointing them keeps that
      // existing library intact instead of stranding it.
      const orphan = await prisma.subject.findFirst({
        where: { examId: null, subjectName: blueprint.subjectName },
      });
      subject = orphan
        ? await prisma.subject.update({ where: { subjectId: orphan.subjectId }, data: { examId: exam.examId } })
        : await prisma.subject.create({ data: { examId: exam.examId, subjectName: blueprint.subjectName } });
      created.subjects += 1;
    }

    const topics = [];
    for (const topicName of blueprint.topics) {
      const topic = await prisma.topic.upsert({
        where: { subjectId_topicName: { subjectId: subject.subjectId, topicName } },
        update: {},
        create: { subjectId: subject.subjectId, topicName },
      });
      if (topic) topics.push(topic);
    }
    created.topics += topics.length;
    subjects.push({ subject, topics });
  }

  return { subjects, created };
}

async function seedQuestions(topic) {
  const bank = QUESTION_BANK[topic.topicName];
  if (!bank) return [];

  const questions = [];
  for (const [questionText, options, correctIndex, explanation] of bank) {
    const existing = await prisma.question.findFirst({
      where: { topicId: topic.topicId, questionText },
      include: { answerOptions: true },
    });
    if (existing) {
      questions.push(existing);
      continue;
    }

    const question = await prisma.question.create({
      data: {
        topicId: topic.topicId,
        questionText,
        questionType: "multiple-choice",
        difficultyLevel: "medium",
        correctAnswer: options[correctIndex],
        explanation,
        answerOptions: {
          create: options.map((optionText, idx) => ({ optionText, isCorrect: idx === correctIndex })),
        },
      },
      include: { answerOptions: true },
    });
    questions.push(question);
  }
  return questions;
}

async function seedQuiz(subject, topics, questionsByTopic) {
  const title = `កម្រងសំណួរ ${subject.subjectName}`;
  let quiz = await prisma.quiz.findFirst({ where: { subjectId: subject.subjectId, title } });
  if (!quiz) {
    quiz = await prisma.quiz.create({
      data: { subjectId: subject.subjectId, title, difficultyLevel: "medium", durationMinutes: 20 },
    });
  }

  // Two questions per topic keeps the quiz short enough to finish in one
  // sitting while still touching every topic the course can point at.
  let order = 0;
  for (const topic of topics) {
    const pool = questionsByTopic.get(topic.topicId) || [];
    for (const question of pool.slice(0, 2)) {
      order += 1;
      await prisma.quizQuestion.upsert({
        where: { quizId_questionId: { quizId: quiz.quizId, questionId: question.questionId } },
        update: {},
        create: { quizId: quiz.quizId, questionId: question.questionId, questionOrder: order },
      });
    }
  }
  return quiz;
}

async function seedMockExam(exam, subjectBundles, questionsByTopic) {
  const title = `ប្រឡងសាកល្បង ${exam.examName}`;
  let mockExam = await prisma.mockExam.findFirst({ where: { examId: exam.examId, title } });
  if (!mockExam) {
    mockExam = await prisma.mockExam.create({
      data: {
        examId: exam.examId,
        title,
        description: `ការប្រឡងសាកល្បងពេញលេញសម្រាប់${exam.examName}`,
        year: new Date().getFullYear(),
        durationMinutes: 90,
        totalMarks: 100,
        passingMarks: 50,
      },
    });
  }

  for (const { subject, topics } of subjectBundles) {
    const section = await prisma.mockExamSection.upsert({
      where: { mockExamId_subjectId: { mockExamId: mockExam.mockExamId, subjectId: subject.subjectId } },
      update: {},
      create: { mockExamId: mockExam.mockExamId, subjectId: subject.subjectId, numberOfQuestions: 0 },
    });

    let order = 0;
    let count = 0;
    for (const topic of topics) {
      const pool = questionsByTopic.get(topic.topicId) || [];
      for (const question of pool.slice(0, 1)) {
        order += 1;
        count += 1;
        await prisma.mockExamQuestion.upsert({
          where: { sectionId_questionId: { sectionId: section.sectionId, questionId: question.questionId } },
          update: {},
          create: { sectionId: section.sectionId, questionId: question.questionId, questionOrder: order },
        });
      }
    }

    await prisma.mockExamSection.update({
      where: { sectionId: section.sectionId },
      data: { numberOfQuestions: count },
    });
  }

  return mockExam;
}

async function seedPreparationPapers(exam, subjectBundles) {
  // The course generator only attaches papers with paperType "prepare-paper";
  // the library shipped with past-papers only, so nothing was ever attachable.
  let created = 0;
  for (const { subject } of subjectBundles) {
    const title = `ឯកសារត្រៀម ${subject.subjectName} — ${exam.examName}`;
    const existing = await prisma.pastPaper.findFirst({
      where: { subjectId: subject.subjectId, title, paperType: "prepare-paper" },
    });
    if (existing) continue;

    await prisma.pastPaper.create({
      data: {
        examId: exam.examId,
        subjectId: subject.subjectId,
        title,
        year: new Date().getFullYear(),
        paperType: "prepare-paper",
        hasAnswerKey: true,
        totalQuestions: 20,
      },
    });
    created += 1;
  }
  return created;
}

async function main() {
  console.log("Seeding learning content...\n");

  const exams = await upsertExams();
  console.log(`Exams ready: ${exams.map((e) => `${e.examName} (${e.targetCode})`).join(", ")}\n`);

  const totals = { subjects: 0, topics: 0, questions: 0, quizzes: 0, mockExams: 0, papers: 0 };

  for (const exam of exams) {
    const { subjects: bundles, created } = await upsertSubjectsAndTopics(exam);
    totals.subjects += created.subjects;

    const questionsByTopic = new Map();
    for (const { topics } of bundles) {
      for (const topic of topics) {
        const questions = await seedQuestions(topic);
        questionsByTopic.set(topic.topicId, questions);
        totals.questions += questions.length;
        totals.topics += 1;
      }
    }

    for (const { subject, topics } of bundles) {
      await seedQuiz(subject, topics, questionsByTopic);
      totals.quizzes += 1;
    }

    await seedMockExam(exam, bundles, questionsByTopic);
    totals.mockExams += 1;

    totals.papers += await seedPreparationPapers(exam, bundles);

    console.log(`  ${exam.examName}: ${bundles.length} subjects wired`);
  }

  console.log("\nDone.");
  console.log(
    `  subjects linked: ${totals.subjects}, topics: ${totals.topics}, questions: ${totals.questions}, quizzes: ${totals.quizzes}, mock exams: ${totals.mockExams}, prepare-papers: ${totals.papers}`
  );
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect?.();
    process.exit(process.exitCode || 0);
  });
