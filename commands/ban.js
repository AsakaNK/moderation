/**
 * @author Luna Le Breton
 * @description
 *      Contient la commande 'ban'.
 *      ban the méchant user.
 */

const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');


/* ----------------------------------------------- */
/* COMMAND BUILD                                   */
/* ----------------------------------------------- */
const slashCommand = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("[modération] Commande pour ban quelqu'un de méchant et pas gentil :neko_angry:")
    .addUserOption(option =>
		option.setName('membre')
			.setDescription('le membre pas gentil à bannir')
            .setRequired(true))
    .addStringOption(option =>
		option.setName('raison')
			.setDescription('pourquoi bannir cette personne de pas gentil *pout*')
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);


/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * 
 * Fonction appelé quand la commande est 'advice'
 * @param {CommandInteraction} interaction L'interaction généré par l'exécution de la commande.
 */

async function execute(interaction) {

    const user = interaction.options.getUser('membre')  //pour avoir le user
    const member = await interaction.guild.members.cache.get(user.id);      //pour avoir l'id du membre
    const raison = interaction.options.getString('raison')      //pour avoir la raison
    const banEmbed = new EmbedBuilder()
    .setColor(0x2F3136)
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
    .setTitle( `${interaction.user.tag} a bien été banni de Neko Paradise`)
    .setTimestamp()
    .setDescription(`<t:${Date.now().toString().slice(0,-3)}:R> pour la raison : ${raison}`)


    const errEmbed = new EmbedBuilder()
        .setColor(0x2F3136)
        .setTitle("Tu ne peux pas bannir les membres qui ont un rôle supérieur au tien")

if (member.roles.highest.position >= interaction.member.roles.highest.position)     //si le role est plus bas ça ne ban pas et ça envoie l'embed erreur
    return interaction.reply({embeds: [errEmbed], 
    ephemeral: true});

await interaction.options.get('membre').member.ban({
        deleteMessageSeconds: 24*3600,
        reason: interaction.options.get('raison').value,
})

    await interaction.reply({ embeds: [banEmbed],
    ephemeral: true })



}

/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
    data: slashCommand,
    execute,
};