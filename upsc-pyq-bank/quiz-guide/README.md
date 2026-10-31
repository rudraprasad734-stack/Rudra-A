# How to write UPSC-style questions for Current Affairs Quizzes

This is the saved "training" for writing quiz questions. Read it before writing or editing any question in `page/quiz/*.json`, then run the checker:

```
python3 quiz-guide/lint_quiz.py page/quiz/2026-09.json
```

It is built from the 595 proofread Prelims GS Paper I questions in `bank-docs/` (papers 2014, 2015, 2020, 2021, 2024, 2025). `pyq_stats.py` recomputes every number below into `pyq-stats.json`. Official answers are in the bank only for 2024, so nothing here depends on answers except the 2024 answer-position check.

What this is not: it does not copy any past question. It records the shape of UPSC questions, so new questions on current facts read and behave the same way. The facts still come from official sources, written in our own words, with the "Why", "Insight" and source line the app already shows.

## 1. What UPSC actually asks (the mix has changed)

| Year | Statements or items ("1 and 2 only") | "How many of the above" | Statement I / Statement II | Single answer ("Which one of the following") | Pairs |
|---|---|---|---|---|---|
| 2014 | 52 | 0 | 0 | 33 | 14 |
| 2015 | 44 | 0 | 0 | 53 | 3 |
| 2020 | 59 | 0 | 0 | 36 | 5 |
| 2021 | 54 | 0 | 1 | 38 | 1 |
| 2024 | 44 | 18 | 13 | 25 | 0 |
| 2025 | 42 | 27 | 14 | 17 | 0 |

The 2024–25 papers are the pattern to follow: about 43% statements or items, 22% "how many", 14% Statement I/II, and only 21% single-answer questions. Pairs ("Consider the following pairs") disappeared after 2021; "how many" replaced them.

**Target for each month pack:** statements/items 35–55%, how-many 15–30%, Statement I/II 8–18%, single-answer 15–35%. The checker warns outside these ranges.

## 2. The templates

### A. Statements (the workhorse)
- Opening: "Consider the following statements:" or "With reference to X, consider the following statements:". A "Which of the following statements about X is/are correct?" opening is also used.
- 2–5 numbered statements. In 2024–25: 3 statements 52%, 2 statements 29%, 4 statements 16%, 5 statements 2%.
- Closing line: "Which of the statements given above is/are correct?" (or "are correct?" with 3 or more).
- Options for 3 statements, in this order: `1 and 2 only`, `2 and 3 only`, `1 and 3 only`, `1, 2 and 3`. Variants seen: `1 only` in place of one pair.
- Options for 2 statements: `1 only`, `2 only`, `Both 1 and 2`, `Neither 1 nor 2`.
- The statements do not depend on each other. Each one is a short factual claim of about 12 to 25 words.
- The correct combination is "1, 2 and 3" about one time in five and a single statement about one time in three (2024). Do not make "all correct" the habit.

### B. How many of the above
- "Consider the following: 1. … 2. … 3. … How many of the above …?" A list of 3 or 4 names or items, then one property.
- Options, in this order: `Only one`, `Only two`, `All three`, `None` (for four items: `Only one`, `Only two`, `Only three`, `All four`).
- Harder than the statements form because the student can't use elimination between combinations. Use items that look alike but differ on the property.

### C. Statement I / Statement II
- "Consider the following statements:" then `Statement-I: …` and `Statement-II: …`, then "Which one of the following is correct in respect of the above statements?"
- Four fixed options, in this order:
  1. Both Statement-I and Statement-II are correct and Statement-II explains Statement-I
  2. Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I
  3. Statement-I is correct, but Statement-II is incorrect
  4. Statement-I is incorrect, but Statement-II is correct
- Good questions put two true statements on the same topic where the second looks like the reason but is not, or where the cause runs the other way.
- 2025 also uses three statements (I, II, III) with options such as "Only one of the Statements II and III is correct and that explains Statement I".

### D. Single answer
- Openers in use, counted over the 202 single-answer questions: "Which one of the following…" 35, "With reference to …" 19, "Who among/of the following…" 10, "In the context of …" 3.
- Stems average 40 words; 2025 stems average 51. UPSC puts the setting inside the stem ("With reference to the Reserve Bank of India, consider…") and keeps the options short, about 5 to 6 words each.
- All four options are the same kind of thing (four articles, four bodies, four years) and each is a believable answer.

### E. Lists
- "Consider the following countries / rivers / activities:" then a closing line such as "Which of the above are …?" Same option set as statements.

### F. Numerical
- Rare (2025 had a gross primary deficit question): give the figures in the stem and make the wrong options the typical mistakes (forgetting to subtract interest, or adding it).

## 3. How wrong options are built (from reading the 2024–25 papers)

This part is judgment, not counted data.
1. Take a true statement and change one detail: the year, the body, the Article number, a number, "may" for "shall", or "any" for "only".
2. Swap in a neighbour: the institution that sounds right but sits next door (Election Commission for Law Commission), the scheme from the same ministry, the treaty from the same year.
3. Widen or narrow the claim ("all States", "every citizen", "exclusively") until it is false.
4. Reverse cause and effect, or turn a purpose into a result.
5. In a set of statements, make one that is true only because of a word buried in the middle of the sentence.
6. Keep the length and tone of the wrong options the same as the right one. In 2024 the correct option was the longest in 27% of questions, which is chance. In our current packs it is 79–80%, which a student can guess from.

## 4. Style rules
- "With reference to", "In the context of", "is/are", "given above". Negative stems ("not correct", "incorrect", "except") are about 9% of UPSC questions overall and 4 of 200 in 2024–25, so keep them under one in ten.
- Plain Indian-English spelling and Indian units.
- Positions: answer letters spread evenly (2024: A 25, B 22, C 24, D 29). The statement-type option sets keep their fixed order, so shuffle only single-answer options.
- Our additions to UPSC style: every question has a source with a date, a "Why" in one or two sentences, and an "Insight" that adds one related fact. Facts come from official pages (PIB, RBI, MoSPI, ministries, UN bodies), never copied from a magazine.
- A current-affairs hook is not a requirement for every question. UPSC mixes static concepts with a recent event; about one in four of our questions can be a pure static concept anchored to something in the news.

## 5. Where our packs stand (checker output, 30 Oct 2026)

| Pack | Questions | Statements/items | How many | Statement I/II | Single answer |
|---|---|---|---|---|---|
| 2026-09 | 211 | 1% | 2% | 0% | 97% |
| 2026-10 | 51 | 6% | 4% | 0% | 90% |

- Our packs are almost all single-answer questions with short stems (about 15 words against UPSC's 40), where UPSC is now about a fifth single-answer.
- In 79–80% of questions the correct option is the longest one.
- Next step: rewrite the packs to the target mix, rewording options so no option stands out. The verified facts and sources stay; only the question form changes.

## 6. Files
- `README.md`: this guide.
- `pyq_stats.py`: recomputes `pyq-stats.json` from `bank-docs/`.
- `lint_quiz.py`: checks a month file. Errors (exit code 1) are structural, such as a missing field or an answer out of range. Warnings are style gaps against section 1 to 4.
