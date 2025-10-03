import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows bot latency and uptime.');

export const executeInteraction = async (i: ChatInputCommandInteraction) => {
  const sent = await i.reply({ content: 'Pinging...', fetchReply: true });

  const apiLatency = sent.createdTimestamp - i.createdTimestamp;
  const wsPing = i.client.ws.ping;
  const uptime = formatDuration(i.client.uptime);

  await i.editReply(
    `🏓 Pong!\n` +
    `📡 WebSocket Ping: \`${wsPing}ms\`\n` +
    `⏱️ API Latency: \`${apiLatency}ms\`\n` +
    `🕒 Uptime: \`${uptime}\``
  );
};

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}
