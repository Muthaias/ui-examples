import { Activity, Log, Medication, Organization, Person, Priority, ScheduleSpecification, User } from "@/app/health-care/common";
import { DataGenerator, getFixedRandom, RandomContext } from "./common";
import { CommonDataSource, getCommonData } from "./common-data";

type HealthCareDataSource = CommonDataSource & {
    medication: { name: string, related_diseases: string[], common_dosages: string }[];
    activities: { name: string, description: string, sub_activities: string[]}[];
}

function getHealthCareData(): HealthCareDataSource {
    const medication = [
        { "name": "Paracetamol", "related_diseases": ["Smärta", "Feber", "Artros"], "common_dosages": "500 mg - 1000 mg var 6-8 timme" },
        { "name": "Acetylsalicylsyra", "related_diseases": ["Ischemisk hjärtsjukdom", "Stroke", "Trombos"], "common_dosages": "75 mg - 160 mg en gång dagligen" },
        { "name": "Metoprolol", "related_diseases": ["Hypertoni", "Hjärtsvikt", "Förmaksflimmer", "Kärlkramp"], "common_dosages": "50 mg - 100 mg två gånger dagligen" },
        { "name": "Enalapril", "related_diseases": ["Hypertoni", "Hjärtsvikt"], "common_dosages": "5 mg - 20 mg en eller två gånger dagligen" },
        { "name": "Ramipril", "related_diseases": ["Hypertoni", "Hjärtsvikt", "Diabetisk nefropati"], "common_dosages": "2,5 mg - 10 mg en gång dagligen" },
        { "name": "Amlodipin", "related_diseases": ["Hypertoni", "Kärlkramp"], "common_dosages": "5 mg - 10 mg en gång dagligen" },
        { "name": "Furosemid", "related_diseases": ["Hjärtsvikt", "Ödem"], "common_dosages": "20 mg - 80 mg en eller två gånger dagligen" },
        { "name": "Spironolakton", "related_diseases": ["Hjärtsvikt", "Ascites"], "common_dosages": "25 mg - 100 mg en gång dagligen" },
        { "name": "Warfarin", "related_diseases": ["Förmaksflimmer", "Djup ventrombos", "Lungemboli"], "common_dosages": "2 mg - 10 mg dagligen (justeras efter INR)" },
        { "name": "Apixaban", "related_diseases": ["Förmaksflimmer", "Djup ventrombos", "Lungemboli"], "common_dosages": "2,5 mg - 5 mg två gånger dagligen" },
        { "name": "Atorvastatin", "related_diseases": ["Hyperlipidemi", "Ischemisk hjärtsjukdom"], "common_dosages": "10 mg - 80 mg en gång dagligen" },
        { "name": "Simvastatin", "related_diseases": ["Hyperlipidemi", "Ischemisk hjärtsjukdom"], "common_dosages": "10 mg - 40 mg en gång dagligen" },
        { "name": "Metformin", "related_diseases": ["Typ 2-diabetes"], "common_dosages": "500 mg - 1000 mg två gånger dagligen" },
        { "name": "Insulin glargin", "related_diseases": ["Typ 1-diabetes", "Typ 2-diabetes"], "common_dosages": "10 enheter en gång dagligen (justeras individuellt)" },
        { "name": "Levotyroxin", "related_diseases": ["Hypotyreos"], "common_dosages": "25 µg - 200 µg en gång dagligen" },
        { "name": "Omeprazol", "related_diseases": ["Gastroesofageal refluxsjukdom", "Magsår"], "common_dosages": "20 mg - 40 mg en gång dagligen" },
        { "name": "Pantoprazol", "related_diseases": ["Gastroesofageal refluxsjukdom", "Magsår"], "common_dosages": "20 mg - 40 mg en gång dagligen" },
        { "name": "Sertralin", "related_diseases": ["Depression", "Ångestsyndrom"], "common_dosages": "25 mg - 100 mg en gång dagligen" },
        { "name": "Citalopram", "related_diseases": ["Depression", "Ångestsyndrom"], "common_dosages": "10 mg - 40 mg en gång dagligen" },
        { "name": "Mirtazapin", "related_diseases": ["Depression", "Sömnstörning"], "common_dosages": "15 mg - 45 mg en gång dagligen" },
        { "name": "Zopiklon", "related_diseases": ["Insomni"], "common_dosages": "3,75 mg - 7,5 mg vid sänggående" },
        { "name": "Oxazepam", "related_diseases": ["Ångest", "Oro"], "common_dosages": "10 mg - 30 mg 2-3 gånger dagligen" },
        { "name": "Morfin", "related_diseases": ["Svår smärta", "Cancerrelaterad smärta"], "common_dosages": "10 mg - 30 mg var 4:e timme (oral)" },
        { "name": "Oxykodon", "related_diseases": ["Svår smärta", "Cancerrelaterad smärta"], "common_dosages": "5 mg - 20 mg var 4-6 timme" },
        { "name": "Alendronat", "related_diseases": ["Osteoporos"], "common_dosages": "70 mg en gång i veckan" },
        { "name": "Kalcium + vitamin D", "related_diseases": ["Osteoporos", "Vitamin D-brist"], "common_dosages": "Kalcium 500-1000 mg + Vitamin D 800 IE dagligen" },
        { "name": "Digoxin", "related_diseases": ["Hjärtsvikt", "Förmaksflimmer"], "common_dosages": "0,125 mg - 0,25 mg en gång dagligen" },
        { "name": "Tamsulosin", "related_diseases": ["Benign prostatahyperplasi"], "common_dosages": "0,4 mg en gång dagligen" },
        { "name": "Laktulos", "related_diseases": ["Förstoppning"], "common_dosages": "15 ml - 45 ml dagligen, uppdelat på doser" },
        { "name": "Salbutamol", "related_diseases": ["KOL", "Astma"], "common_dosages": "100 µg - 200 µg var 4-6 timme (inhalation)" }
    ];
    const activities = [
        {
            "name": "Personlig hygien",
            "description": "Hjälp med dusch, bad, munvård, hårvård och nagelvård.",
            "sub_activities": [
                "Dusch eller sängbad",
                "Tvätt av över- och underkropp",
                "Hårtvätt och kamning",
                "Nagelklippning",
                "Rakning",
                "Hudinsmörjning"
            ]
        },
        {
            "name": "På- och avklädning",
            "description": "Stöd vid val av kläder samt hjälp att klä på och av sig.",
            "sub_activities": [
                "Val av lämpliga kläder efter väder",
                "Hjälp med strumpor och skor",
                "Anpassning av kläder vid funktionsnedsättning",
                "Hantering av stödstrumpor"
            ]
        },
        {
            "name": "Toalettbesök och inkontinensvård",
            "description": "Hjälp vid toalettbesök, byte av inkontinensskydd och god intimhygien.",
            "sub_activities": [
                "Hjälp till och från toaletten",
                "Byte av inkontinensskydd",
                "Intimhygien",
                "Tömning av kateterpåse"
            ]
        },
        {
            "name": "Förflyttning",
            "description": "Stöd vid förflyttning mellan säng, stol och rullstol samt gångträning.",
            "sub_activities": [
                "Förflyttning med glidbräda",
                "Användning av lift",
                "Stöd vid gång med rollator",
                "Positionering i säng"
            ]
        },
        {
            "name": "Måltidsstöd",
            "description": "Hjälp med matlagning, matning och att säkerställa tillräckligt näringsintag.",
            "sub_activities": [
                "Tillagning av frukost, lunch och middag",
                "Anpassning av konsistens",
                "Matning vid behov",
                "Registrering av matintag"
            ]
        },
        {
            "name": "Läkemedelshantering",
            "description": "Påminnelser om medicinering samt hjälp med dosering enligt ordination.",
            "sub_activities": [
                "Iordningställande av dosett",
                "Administrering av läkemedel",
                "Dokumentation av given dos",
                "Observation av biverkningar"
            ]
        },
        {
            "name": "Sårvård",
            "description": "Rengöring och omläggning av sår enligt vårdplan.",
            "sub_activities": [
                "Sårrengöring",
                "Byte av förband",
                "Bedömning av läkning",
                "Dokumentation"
            ]
        },
        {
            "name": "Trycksårsprevention",
            "description": "Lägesändring, hudinspektion och användning av tryckavlastande hjälpmedel.",
            "sub_activities": [
                "Schemalagd vändning",
                "Hudinspektion",
                "Användning av tryckavlastande madrass",
                "Riskbedömning"
            ]
        },
        {
            "name": "Fallprevention",
            "description": "Riskbedömning, anpassning av miljö och stöd vid gång för att minska fallrisk.",
            "sub_activities": [
                "Borttagning av lösa mattor",
                "Installation av stödhandtag",
                "Bedömning av gångförmåga",
                "Balansövningar"
            ]
        },
        {
            "name": "Mobilisering och träning",
            "description": "Enkla övningar och daglig rörelse för att bibehålla styrka och balans.",
            "sub_activities": [
                "Sittande benövningar",
                "Promenader",
                "Styrketräning med gummiband",
                "Balansövningar"
            ]
        },
        {
            "name": "Kognitiv stimulans",
            "description": "Samtal, minnesträning och aktiviteter som stimulerar hjärnan.",
            "sub_activities": [
                "Minnesträning",
                "Högläsning",
                "Sällskapsspel",
                "Orientering i tid och rum"
            ]
        },
        {
            "name": "Socialt stöd",
            "description": "Sällskap, samtal och stöd för att minska ensamhet.",
            "sub_activities": [
                "Samtal",
                "Gemensamma aktiviteter",
                "Promenader utomhus",
                "Deltagande i sociala evenemang"
            ]
        },
        {
            "name": "Psykiskt stöd",
            "description": "Stöd vid oro, ångest eller nedstämdhet.",
            "sub_activities": [
                "Stödsamtal",
                "Avslappningsövningar",
                "Kontakt med vårdpersonal",
                "Observation av mående"
            ]
        },
        {
            "name": "Sömnstöd",
            "description": "Skapa goda rutiner och miljö för bättre sömn.",
            "sub_activities": [
                "Kvällsrutiner",
                "Minskad störning nattetid",
                "Trygghetskontroller",
                "Anpassning av belysning"
            ]
        },
        {
            "name": "Andningsstöd",
            "description": "Hjälp med inhalationer och andningsövningar vid behov.",
            "sub_activities": [
                "Administrering av inhalation",
                "Andningsövningar",
                "Syrgasbehandling enligt ordination",
                "Observation av andningsfrekvens"
            ]
        },
        {
            "name": "Blodsockerkontroll",
            "description": "Mätning av blodsocker och stöd vid insulinadministrering.",
            "sub_activities": [
                "Kapillär blodsockermätning",
                "Dokumentation av värden",
                "Administrering av insulin",
                "Observation av hypo- eller hyperglykemi"
            ]
        },
        {
            "name": "Blodtryckskontroll",
            "description": "Regelbunden mätning och uppföljning av blodtryck.",
            "sub_activities": [
                "Blodtrycksmätning",
                "Pulskontroll",
                "Dokumentation",
                "Rapportering av avvikande värden"
            ]
        },
        {
            "name": "Vätskebalansövervakning",
            "description": "Säkerställa tillräckligt vätskeintag och observera tecken på uttorkning.",
            "sub_activities": [
                "Registrering av vätskeintag",
                "Erbjuda dryck regelbundet",
                "Observation av urinmängd",
                "Bedömning av hudturgor"
            ]
        },
        {
            "name": "Munhälsovård",
            "description": "Daglig munvård och tillsyn av proteser.",
            "sub_activities": [
                "Tandborstning",
                "Rengöring av protes",
                "Inspektion av munslemhinna",
                "Smörjning av torra läppar"
            ]
        },
        {
            "name": "Städning och hemmiljö",
            "description": "Hjälp med hushållssysslor för en säker och hygienisk miljö.",
            "sub_activities": [
                "Dammsugning",
                "Rengöring av badrum",
                "Sängbäddning",
                "Avfallshantering"
            ]
        },
        {
            "name": "Inköp och ärenden",
            "description": "Stöd vid inköp av mat, läkemedel och andra nödvändigheter.",
            "sub_activities": [
                "Matinköp",
                "Apoteksärenden",
                "Postärenden",
                "Betalning av räkningar"
            ]
        },
        {
            "name": "Transport och ledsagning",
            "description": "Följa med till vårdbesök och andra aktiviteter.",
            "sub_activities": [
                "Ledsagning till läkare",
                "Hjälp med färdtjänst",
                "Stöd vid sjukhusbesök",
                "Följe till sociala aktiviteter"
            ]
        },
        {
            "name": "Kommunikationsstöd",
            "description": "Hjälp vid nedsatt hörsel, syn eller talförmåga.",
            "sub_activities": [
                "Anpassning av hörapparat",
                "Användning av tolk",
                "Förtydligande kommunikation",
                "Stöd vid användning av hjälpmedel"
            ]
        },
        {
            "name": "Närståendestöd",
            "description": "Stöd och information till anhöriga.",
            "sub_activities": [
                "Informationsmöten",
                "Rådgivning",
                "Avlastningsstöd",
                "Delaktighet i vårdplanering"
            ]
        },
        {
            "name": "Palliativ omvårdnad",
            "description": "Symtomlindring och stöd vid vård i livets slutskede.",
            "sub_activities": [
                "Smärtskattning",
                "Symtomlindring",
                "Munvård i livets slut",
                "Stöd till anhöriga"
            ]
        }
    ]
    const common = getCommonData();
    return {
        ...common,
        medication,
        activities,
    }
}

export class HealtCareDataGenerator implements DataGenerator<{
    users: Record<string, User>,
    activities: Record<string, Activity>,
    logs: Record<string, Log>,
    notifications: Record<string, Notification>,
    people: Record<string, Person>,
    organizations: Record<string, Organization>,
}> {
    randomContext: RandomContext;
    period: [Date, Date];
    dataSource: HealthCareDataSource;

    constructor(randomContext: RandomContext, dataSource: HealthCareDataSource, period: [Date, Date]) {
        this.randomContext = randomContext;
        this.dataSource = dataSource;
        this.period = period;
    }

    createOrganizations(numberOfOrganizations: number): Organization[] {
        const groupNames = this.dataSource.groupNames;
        const regionNames = this.dataSource.regionNames;
        return Array.from({ length: numberOfOrganizations }).map<Organization>((_, index) => {
            const name = `${this.randomContext.choice(groupNames)} ${this.randomContext.choice(regionNames)}`;
            return {
                id: `organization-${index}`,
                type: "organization",
                name,
            }
        })
    }

    createPeople(numberOfPeople: number): Person[] {
        const givenNames = [...this.dataSource.maleNames, ...this.dataSource.femaleNames];
        const familyNames = this.dataSource.familyNames;
        const medication = this.dataSource.medication;
        return Array.from({ length: numberOfPeople }).map<Person>((_, index) => {
            const name = this.randomContext.choice(givenNames);
            const fullName = `${name} ${this.randomContext.choice(familyNames)}`;
            return {
                id: `person-${index}`,
                type: "person",
                name,
                fullName,
                notes: "",
                medication: this.randomContext.choices(medication, 8).map<Medication>(m => {
                    const [startsAt, endsAt] = this.randomContext.randdaterange(this.period[0], this.period[1]);
                    return {
                        name: m.name,
                        period: { startsAt, endsAt },
                        dosage: m.common_dosages,
                        usage: this.randomContext.choice(m.related_diseases)
                    }
                })
            }
        })
    }

    createUsers(people: Person[], organizations: Organization[]): User[] {
        const users = people.map<Omit<User, "roles">>((person, index) => {
            return {
                type: "user",
                id: `user-${index}`,
                username: person.fullName.toLowerCase().replaceAll(" ", "-"),
                person: { type: "person", id: person.id },
            }
        });

        const numberOfRecipients = Math.floor(users.length * 0.25);
        const numberOfRelatives = 1;
        const recipients = users.slice(0, numberOfRecipients).map<User>(user => ({
            ...user,
            roles: [{ type: "care-recipient", organization: this.randomContext.choice(organizations) }]
        }));
        const relatives = users.slice(numberOfRecipients, numberOfRecipients + numberOfRelatives).map<User>((user, index) => ({
            ...user,
            roles: [{
                type: "care-recipient-relation",
                recipient: { type: "user", id: recipients[Math.floor(index * 0.5)].id }
            }]
        }));
        const careTakers = users.slice(numberOfRecipients + numberOfRelatives).map<User>(user => ({
            ...user,
            roles: [{ type: "care-taker", organization: this.randomContext.choice(organizations) }]
        }));

        return [
            ...recipients,
            ...relatives,
            ...careTakers,
        ]
    }

    createActivities(numberOfActivities: number, users: User[]): Activity[] {
        const recipients = users.filter(user => user.roles.some(r => r.type === "care-recipient"));
        const careTakers = users.filter(user => user.roles.some(r => r.type === "care-taker"));
        return Array.from({ length: numberOfActivities }).map<Activity>((_, index) => {
            const recipient = this.randomContext.choice(recipients);
            const useSchedule = this.randomContext.randint(0, 100) > 10;
            const isCertain = this.randomContext.randbool()
            const schedule: ScheduleSpecification = isCertain ? {
                certainty: "certain",
                time: this.randomContext.randdate(this.period[0], this.period[1])
            } : {
                certainty: "uncertain",
                time: this.randomContext.randdate(this.period[0], this.period[1]),
                timeRange: this.randomContext.randint(1, 5) * 3600 * 24,
            }
            const startDate = schedule.time;
            const actiivity = this.randomContext.choice(this.dataSource.activities);
            return {
                id: `activity-${index}`,
                type: "activity",
                createdAt: this.randomContext.randdate(startDate, this.period[1]),
                createdBy: this._toRef(this.randomContext.choice(careTakers)),
                recipient: this._toRef(recipient),
                title: actiivity.name,
                content: [actiivity.description, ...this.randomContext.choices(actiivity.sub_activities, this.randomContext.randint(1, actiivity.sub_activities.length))].join("\n"),
                timeNeeded: this.randomContext.randint(1, 5) * 3600,
                priority: this.randomContext.choice<Priority>(["danger", "info", "primary", "secondary", "success", "warning"]),
                status: this.randomContext.choice<Activity["status"]>(["accepted", "done", "new"]),
                schedule: useSchedule ? schedule : undefined,
            }
        })
    }

    createLogs(activities: Activity[]): Log[] {
        return activities.filter(a => a.status === "done").map<Log>((a, index) => ({
            type: "log",
            id: `log-${index}`,
            createdAt: a.createdAt,
            createdBy: a.createdBy,
            content: a.content,
            recipient: a.recipient,
        }))
    }

    _toRecord<T extends { id: string }>(items: T[]): Record<string, T> {
        return items.reduce<Record<string, T>>((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {})
    }

    _toRef<T extends { id: string, type: unknown }>(obj: T): Pick<T, "id" | "type"> {
        return {
            id: obj.id,
            type: obj.type
        }
    }

    createData() {
        const people = this.createPeople(8);
        const organizations = this.createOrganizations(5);
        const users = this.createUsers(people, organizations);
        const activities = this.createActivities(300, users);
        return {
            organizations: this._toRecord(organizations),
            people: this._toRecord(people),
            users: this._toRecord(users),
            activities: this._toRecord(activities),
            logs: this._toRecord(this.createLogs(activities)),
            notifications: {}
        }
    }
}

export function getGenerator() {
    return new HealtCareDataGenerator(
        getFixedRandom(),
        getHealthCareData(),
        [new Date("2026-01-01T00:00:00.000Z"), new Date("2027-01-01T00:00:00.000Z")],
    )
}