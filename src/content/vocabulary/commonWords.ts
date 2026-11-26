/**
 * Very common English words (roughly A1–A2), beyond the function words in
 * lib/text/stopwords. A text's "new words" leave these out, so the list shows words worth
 * learning (deployment, rollback) rather than ones a learner already knows (team, often).
 * Base forms; simple endings (-s, -ed, -ing) are matched by the lemma helper.
 */
export const COMMON_WORDS = new Set(
  (
    'able accept across act add address afraid after afternoon again age ago agree air all allow almost alone along already ' +
    'also always among amount angry animal another answer anybody anyone anything anyway apartment appear apple area arm around arrive art ' +
    'ask away baby back bad bag ball bank bar base bath beautiful because become bed before begin behind believe best better between ' +
    'big bill bird birthday bit black blue board boat body book born borrow boss both bottle bottom box boy brain bread break ' +
    'breakfast bring brother brown build building bus business busy buy call camera can car card care careful carry case cat ' +
    'catch cause center centre chair chance change cheap check child children choose city class clean clear climb clock close clothes cloud ' +
    'club coat coffee cold college color colour come common company complete computer cook cool copy corner correct cost could count ' +
    'country couple course cover crazy cross cry cup cut dad dance dark date daughter day dead dear decide deep describe desk ' +
    'die different difficult dinner dirty doctor dog door down draw dream dress drink drive drop dry during each ear early ' +
    'earth easy eat egg either else email empty end enjoy enough enter even evening event ever every everybody everyone everything example ' +
    'except excited exciting expensive explain eye face fact fall family famous far farm fast fat father favorite favourite fear feel ' +
    'few field fight fill film final find fine finger finish fire first fish fit fix floor flower fly follow food foot ' +
    'football forget form free fresh friend friendly front fruit full fun funny future game garden get gift girl give glad glass ' +
    'good great green ground group grow guess guy hair half hand happen happy hard hat hate head health hear heart heavy ' +
    'hello help here high hill history hit hold holiday home hope horse hospital hot hotel hour house however huge human hungry ' +
    'hurry hurt idea ill important inside interest interesting invite island job join joke juice jump just keep key kid kill ' +
    'kind king kitchen know lady lake land language large last late later laugh learn least leave left leg less lesson letter ' +
    'level library lie life light like line list listen little live long look lose lot loud love low lunch machine make ' +
    'man many map mark market married matter maybe meal mean meet meeting member message middle might mind minute miss mistake modern ' +
    'mom moment money month more morning most mother mountain mouth move movie much mum music must name near need never new news ' +
    'next nice night nobody noise normal north nose note nothing notice now number nurse office often old once online only open ' +
    'opinion order other out outside over own page pain paint pair paper parent park part party pass past pay pen people ' +
    'perfect perhaps person phone photo pick picture piece place plan plant play player please pocket point police poor popular possible ' +
    'post practice prefer prepare present pretty price print probably problem program project pull push put question quick quickly quiet quite ' +
    'rain read ready real really reason receive red relax remember rent repeat rest restaurant return rich ride right ring river ' +
    'road room round rule run sad safe sale same save say school sea season seat second see seem sell send sentence ' +
    'serious set several share shirt shoe shop short should show shower shut sick side sign simple since sing sister sit ' +
    'situation size skill sleep slow slowly small smart smell smile snow soft some somebody someone something sometimes son song soon sorry ' +
    'sound south space speak special spend sport spring stand star start station stay step still stop store story strange street ' +
    'strong student study stupid style subject success such sugar summer sun sure surprise sweet swim system table take talk tall ' +
    'taste taxi tea teach teacher team tell test text thank thing think thirsty though thought through ticket time tired today ' +
    'together tomorrow tonight too top touch town train travel tree trip trouble true try turn type under understand until up ' +
    'use useful usual usually vacation very visit voice wait wake walk wall want warm wash watch water way wear weather ' +
    'website week weekend welcome well west wet while white whole why wife win window winter wish without woman wonderful word ' +
    'work world worry write wrong year yellow yes yesterday yet young monday tuesday wednesday thursday friday saturday sunday january february ' +
    'march april may june july august september october november december one two three four five six seven eight nine ten hundred ' +
    'thousand million first second third late fail fix check log send open close start'
  ).split(' '),
)
