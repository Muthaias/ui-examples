export type EntityRef<T> = {
    id: string;
    type: T;
}

export type ActivityRef = EntityRef<"activity">;
export type MessageContextRef = EntityRef<"message-context">;
export type UserRef = EntityRef<"user">;
export type PersonRef = EntityRef<"person">;
export type OrganizationRef = EntityRef<"organization">;
export type NotificationRef = EntityRef<"notification">;
export type LogRef = EntityRef<"log">;

export type CreateTracking = {
    createdBy: UserRef;
    createdAt: Date;
}

export type Organization = OrganizationRef & {
    name: string;
}

export type UserRole = {
    type: "care-recipient";
    organization: OrganizationRef;
} | {
    type: "care-recipient-relation";
    recipient: UserRef;
} | {
    type: "care-taker";
    organization: OrganizationRef;
}

export type User = UserRef & {
    username: string;
    roles: UserRole[];
    person: PersonRef;
}

export type Person = PersonRef & {
    name: string;
    fullName: string;
    contact?: ContactInformation;
    notes: string;
    medication?: Medication[];
}

export type Medication = {
    period: Period;
    dosage: string;
    name: string;
    usage: string;
}

export type ContactInformation = {
    city?: string;
    address?: string;
    postalCode?: string;
    email?: string;
    phoneNumber: string;
}

export type Priority = "primary" | "secondary" | "success" | "danger" | "warning" | "info";

export type Activity = ActivityRef & CreateTracking & {
    recipient: UserRef;
    title: string;
    content: string;
    timeNeeded: number;
    priority: Priority;
    status: "new" | "accepted" | "done";
    schedule?: ScheduleSpecification;
}

export type ScheduleSpecification = {
    certainty: "certain";
    time: Date;
} | {
    certainty: "uncertain";
    time: Date;
    timeRange: number;
};

export type MessageContext = MessageContextRef & {
    target: "activity";
    activity: ActivityRef;
}

export type Message = CreateTracking & {
    context: MessageContextRef;
    content: string;
}

export type Notification = NotificationRef & {
    user: UserRef;
    content: string;
    target?: EntityRef<unknown>;
    priority: Priority;
}

export type Log = LogRef & CreateTracking & {
    content: string;
    target?: EntityRef<unknown>;
    recipient: UserRef;
}

export type Period = {
    startsAt: Date;
    endsAt: Date;
}