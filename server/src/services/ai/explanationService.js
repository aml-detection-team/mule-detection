import buildEvidence from "./evidenceBuilder.js";
import maskPII from "./piiMasker.js";
import buildPrompt from "./promptBuilder.js";
import validateExplanation from "./outputValidator.js";
import generateAIResponse from "./aiProvider.js";


async function generateExplanation(detectionResult) {

    // -----------------------------------------
    // 1. Convert B's result into AI evidence
    // -----------------------------------------

    const evidence =
        buildEvidence(detectionResult);


    // -----------------------------------------
    // 2. Mask unnecessary PII
    // -----------------------------------------

    const safeEvidence =
        maskPII(evidence);


    // -----------------------------------------
    // 3. Build the LLM prompt
    // -----------------------------------------

    const prompt =
        buildPrompt(safeEvidence);


    // -----------------------------------------
    // 4. Generate AI explanation
    // -----------------------------------------

    const explanation =
        await generateAIResponse(
            prompt,
            safeEvidence
        );


    // -----------------------------------------
    // 5. Validate AI output
    // -----------------------------------------

    const validation =
        validateExplanation(
            explanation,
            safeEvidence
        );


    if (!validation.valid) {

        throw new Error(
            `AI explanation failed validation: ${
                validation.errors.join("; ")
            }`
        );
    }


    // -----------------------------------------
    // 6. Return everything useful
    // -----------------------------------------

    return {
        explanation,
        evidence: safeEvidence,
        prompt
    };
}


export default generateExplanation;