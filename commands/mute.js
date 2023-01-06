/**
 * @author Luna Le Breton
 * @description
 *      Contient la commande 'mute'.
 *      mute the méchant user.
 */

const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getMsTime } = require("../../../utils/dateUtils");


/* ----------------------------------------------- */
/* COMMAND BUILD                                   */
/* ----------------------------------------------- */
const slashCommand = new SlashCommandBuilder()
    .setName("mute")
    .setDescription("[modération] Commande pour mute quelqu'un de méchant et pas gentil :neko_angry:")
    .addUserOption(option =>
		option.setName('membre')
			.setDescription('le membre pas gentil à muter')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('temps')
            .setDescription('Le temps pour que le membre pas gentil se calme')
            .setRequired(true))
    .addStringOption(option =>
		option.setName('raison')
			.setDescription('pourquoi mute cette personne de pas gentil *pout*')
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers);


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
    .setTitle( `${interaction.user.tag} a bien été mute de Neko Paradise`)
    .setTimestamp()
    .setDescription(`<t:${Date.now().toString().slice(0,-3)}:R> pour la raison : ${raison}`)


    const errEmbed = new EmbedBuilder()
        .setColor(0x2F3136)
        .setTitle("Tu ne peux pas muter les membres qui ont un rôle supérieur au tien")

    if (member.roles.highest.position >= interaction.member.roles.highest.position)     //si le role est plus bas ça ne ban pas et ça envoie l'embed erreur
        return interaction.reply({embeds: [errEmbed], 
            ephemeral: true});

    let temps = await interaction.options.getString('temps')      //pour avoir le temps
    
    
    await interaction.options.get('membre').member.timeout(getMsTime(temps),interaction.options.get('raison').value,)

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