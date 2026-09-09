function validateExplanation(explanation, evidence) {

    const errors = [];

    // --------------------------------------------------
    // Basic explanation validation
    // --------------------------------------------------

    if (!explanation || typeof explanation !== "object") {
        return {
            valid: false,
            errors: ["Explanation must be an object"]
        };
    }


    // --------------------------------------------------
    // Summary
    // --------------------------------------------------

    if (
        typeof explanation.summary !== "string"
    ) {
        errors.push(
            "summary must be a string"
        );
    }


    // --------------------------------------------------
    // observedPatterns
    // --------------------------------------------------

    if (
        !Array.isArray(
            explanation.observedPatterns
        )
    ) {

        errors.push(
            "observedPatterns must be an array"
        );

    } else {

        // ----------------------------------------------
        // Collect valid transaction IDs from evidence
        // ----------------------------------------------

        const validTransactionIds =
            new Set();

        if (
            evidence &&
            Array.isArray(evidence.alerts)
        ) {

            for (const alert of evidence.alerts) {

                const ids =
                    alert.evidence?.transactionIds || [];

                for (const id of ids) {
                    validTransactionIds.add(id);
                }
            }
        }


        // ----------------------------------------------
        // Validate each observed pattern
        // ----------------------------------------------

        explanation.observedPatterns.forEach(
            (pattern, index) => {

                // Pattern name
                if (
                    typeof pattern.pattern !== "string"
                ) {

                    errors.push(
                        `observedPatterns[${index}].pattern must be a string`
                    );
                }


                // Observed facts
                if (
                    !Array.isArray(
                        pattern.observedFacts
                    )
                ) {

                    errors.push(
                        `observedPatterns[${index}].observedFacts must be an array`
                    );

                } else {

                    pattern.observedFacts.forEach(
                        (fact, factIndex) => {

                            if (
                                typeof fact !== "string"
                            ) {

                                errors.push(
                                    `observedPatterns[${index}].observedFacts[${factIndex}] must be a string`
                                );
                            }
                        }
                    );
                }


                // Interpretation
                if (
                    typeof pattern.interpretation !== "string"
                ) {

                    errors.push(
                        `observedPatterns[${index}].interpretation must be a string`
                    );
                }


                // Transaction IDs
                if (
                    !Array.isArray(
                        pattern.evidenceTransactionIds
                    )
                ) {

                    errors.push(
                        `observedPatterns[${index}].evidenceTransactionIds must be an array`
                    );

                } else {

                    pattern.evidenceTransactionIds.forEach(
                        (transactionId) => {

                            if (
                                !validTransactionIds.has(
                                    transactionId
                                )
                            ) {

                                errors.push(
                                    `Invalid transaction ID "${transactionId}" in observedPatterns[${index}]`
                                );
                            }
                        }
                    );
                }
            }
        );
    }


    // --------------------------------------------------
    // Transaction flow
    // --------------------------------------------------

    if (
        typeof explanation.transactionFlow !==
        "string"
    ) {

        errors.push(
            "transactionFlow must be a string"
        );
    }


    // --------------------------------------------------
    // Investigation questions
    // --------------------------------------------------

    if (
        !Array.isArray(
            explanation.investigationQuestions
        )
    ) {

        errors.push(
            "investigationQuestions must be an array"
        );

    } else {

        explanation.investigationQuestions.forEach(
            (question, index) => {

                if (
                    typeof question !== "string"
                ) {

                    errors.push(
                        `investigationQuestions[${index}] must be a string`
                    );
                }
            }
        );
    }


    // --------------------------------------------------
    // Limitations
    // --------------------------------------------------

    if (
        !Array.isArray(
            explanation.limitations
        )
    ) {

        errors.push(
            "limitations must be an array"
        );

    } else {

        explanation.limitations.forEach(
            (limitation, index) => {

                if (
                    typeof limitation !== "string"
                ) {

                    errors.push(
                        `limitations[${index}] must be a string`
                    );
                }
            }
        );
    }


    // --------------------------------------------------
    // Final result
    // --------------------------------------------------

    return {
        valid: errors.length === 0,
        errors
    };
}


export default validateExplanation;