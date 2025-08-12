/** biome-ignore-all lint/style/useNamingConvention: Mirroring existing module */
/** biome-ignore-all lint/style/noEnum: Mirroring existing module */
import { vi } from "vitest";

const slashCommandStringOption = {
	setAutocomplete: vi.fn(function (this: unknown) {
		return this;
	}),
	setDescription: vi.fn(function (this: unknown) {
		return this;
	}),
	setMaxLength: vi.fn(function (this: unknown) {
		return this;
	}),
	setMinLength: vi.fn(function (this: unknown) {
		return this;
	}),
	setName: vi.fn(function (this: unknown) {
		return this;
	}),
	setRequired: vi.fn(function (this: unknown) {
		return this;
	}),
};
export const SlashCommandStringOption = vi.fn(() => slashCommandStringOption);

const slashCommandBuilder = {
	addSubcommand: vi.fn(function (this: unknown) {
		return this;
	}),
	setDescription: vi.fn(function (this: unknown) {
		return this;
	}),
	setName: vi.fn(function (this: unknown) {
		return this;
	}),
	toJSON: vi.fn(() => ({ cmdData: { options: [] } })),
};
export const SlashCommandBuilder = vi.fn(() => slashCommandBuilder);

export const SlashCommandSubcommandBuilder = vi.fn(() => ({
	addStringOption: vi.fn(function (this: unknown) {
		return this;
	}),
	setDescription: vi.fn(function (this: unknown) {
		return this;
	}),
	setName: vi.fn(function (this: unknown) {
		return this;
	}),
	toJSON: vi.fn(),
}));

const client = {
	login: vi.fn(),
	on: vi.fn(),
	once: vi.fn(),
	user: {
		tag: "TestBot#1234",
	},
};

export const Client = vi.fn(() => client);

export const Events = {
	ClientReady: "ready",
};

export enum GatewayIntentBits {
	Guilds = 1,
	GuildMembers = 2,
	GuildModeration = 4,
	GuildBans = 4,
	GuildExpressions = 8,
	GuildEmojisAndStickers = 8,
	GuildIntegrations = 16,
	GuildWebhooks = 32,
	GuildInvites = 64,
	GuildVoiceStates = 128,
	GuildPresences = 256,
	GuildMessages = 512,
	GuildMessageReactions = 1024,
	GuildMessageTyping = 2048,
	DirectMessages = 4096,
	DirectMessageReactions = 8192,
	DirectMessageTyping = 16384,
	MessageContent = 32768,
	GuildScheduledEvents = 65536,
	AutoModerationConfiguration = 1048576,
	AutoModerationExecution = 2097152,
	GuildMessagePolls = 16777216,
	DirectMessagePolls = 33554432,
}

export enum ApplicationIntegrationType {
	GuildInstall = 0,
	UserInstall = 1,
}

export enum PermissionFlagsBits {
	CreateInstantInvite = "CreateInstantInvite",
	KickMembers = "KickMembers",
	BanMembers = "BanMembers",
}

export enum InteractionContextType {
	Guild = 0,
	BotDM = 1,
	PrivateChannel = 2,
}

export enum MessageFlags {
	Crossposted = 1,
	IsCrosspost = 2,
	SuppressEmbeds = 4,
	SourceMessageDeleted = 8,
	Urgent = 16,
	HasThread = 32,
	Ephemeral = 64,
	Loading = 128,
	FailedToMentionSomeRolesInThread = 256,
	ShouldShowLinkNotDiscordWarning = 1024,
	SuppressNotifications = 4096,
	IsVoiceMessage = 8192,
	HasSnapshot = 16384,
	IsComponentsV2 = 32768,
}

const rest = {
	put: vi.fn().mockImplementation(() => []),
	setToken: vi.fn(function (this: unknown) {
		return this;
	}),
};

export const REST = vi.fn(() => rest);

export const Routes = {
	applicationCommands: vi.fn(() => "/applications/{application.id}/commands"),
};

const embedBuilder = {
	addFields: vi.fn(function (this: unknown) {
		return this;
	}),
	setColor: vi.fn(function (this: unknown) {
		return this;
	}),
	setDescription: vi.fn(function (this: unknown) {
		return this;
	}),
	setTitle: vi.fn(function (this: unknown) {
		return this;
	}),
};

export const EmbedBuilder = vi.fn(() => embedBuilder);
