/** Short function words that are naturally frequent; never reported as overused. */
export const STOPWORDS = new Set(
  (
    'a an the and or but so if then than that this these those to of in on at for from with by ' +
    'as is are was were be been being am do does did have has had i you he she it we they me ' +
    'him her us them my your his its our their not no yes can could will would should may ' +
    'might must just also very there here what when where which who how all any some about ' +
    "up out into over after before i'm it's don't i've i'll can't won't"
  ).split(' '),
)
