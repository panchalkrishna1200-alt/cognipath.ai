---
name: debug-question-generation
description: "Diagnose and fix Cognipath AI assessment questions that fail to generate, show only sample questions, return an empty list, or fail in the frontend. Use when debugging the FastAPI assessment endpoint, OpenAI question generator, RAG context, document topics, environment variables, or the React Assessment page."
argument-hint: "Describe the symptom, error message, or whether sample questions appear"
user-invocable: true
disable-model-invocation: false
---

# Debug Question Generation

## Outcome

Restore the assessment-generation flow and prove that the API returns the expected question count and schema. Keep fallback behavior intentional: sample questions are acceptable only when no live LLM key is configured or the provider call fails, and the user should be told which case occurred.

## Workflow

1. **Capture the symptom**
   - Record whether clicking `Generate diagnostic assessment` does nothing, shows a frontend error, returns no questions, or returns `[Sample]` questions.
   - Capture the browser Network response for `POST /api/assessment/generate` and the backend terminal log.
   - Do not treat an HTTP 200 response with sample questions as successful live generation.

2. **Check the controlling path**
   - Start at `frontend/src/pages/Assessment.jsx` and confirm the request includes the current `student_id` and `document_id`.
   - Follow `frontend/src/api/client.js` to confirm the API base URL and surfaced error detail.
   - Inspect `backend/api/assessment.py` for document lookup, topic selection, RAG retrieval, question generation, persistence, and response sanitization.
   - Inspect `backend/ai/question_generator.py` for provider configuration, fallback selection, response parsing, and validation.

3. **Run the cheapest discriminating checks**
   - Confirm the backend is running and inspect `GET /docs` or the assessment route in the API docs.
   - Confirm the uploaded document exists, has a non-empty `topics_detected` value, and that `student_id` and `document_id` refer to existing records.
   - From the same shell that starts FastAPI, inspect whether `OPENAI_API_KEY` is set and whether `COGNIPATH_LLM_MODEL` names an available model. Never print the key value.
   - Compare the configured variable with the implementation. The generator reads `OPENAI_API_KEY`; documentation or `.env.example` mentioning only `ANTHROPIC_API_KEY` does not enable this implementation.
   - Call the endpoint with a known document and a small `questions_per_topic` value. Distinguish these outcomes:
     - `404`: document or route setup problem.
     - `422`: no detected topics or invalid request data.
     - `500`: backend dependency, database, RAG, or provider exception.
     - `200` with `[Sample]`: fallback path, usually missing key or provider failure.
     - `200` with zero questions: topic loop, parsing, or persistence contract problem.
     - `200` with four-option questions: generation path is functioning.

4. **Fix the smallest owning cause**
   - If the key is missing, load the correct variable into the backend process and restart it. Do not add secrets to source control.
   - If project documentation or `.env.example` names a different provider than the code, align the documentation/configuration with the provider actually used, or deliberately migrate the implementation as a separate change.
   - If the provider responds but parsing rejects it, inspect the raw response shape and update `_parse_and_validate` only as needed. Preserve the required fields: `question`, four `options`, and an integer `correct_index` from 0 through 3.
   - If RAG returns no chunks, verify the document was extracted and indexed before changing question-generation logic. Empty context is supported and should still produce general questions.
   - If the API succeeds but the screen is empty, inspect the JSON response shape and React state update before changing backend behavior.

5. **Validate the complete slice**
   - Re-run the narrow API request and verify the requested number of questions per topic.
   - Verify each returned question has text, exactly four options, a valid `correct_index`, a topic, and a valid Bloom level.
   - Verify `correct_index` is absent from the frontend response but remains available in the stored assessment for grading.
   - In the browser, answer every question and submit the assessment. Confirm the score and topic breakdown are returned.
   - Run the narrowest available Python syntax/import check and frontend build or lint check after code changes.

## Decision Rules

- Prefer evidence from the HTTP response and backend log over assumptions based on the button label.
- Treat missing configuration, provider failure, invalid provider JSON, and missing document topics as different failure classes.
- Do not remove fallback questions merely to hide configuration problems.
- Do not expose `correct_index` in the assessment-generation response.
- Do not log API keys or copy secrets into `.env` examples, commits, screenshots, or chat.

## Completion Checklist

- The root cause is named and tied to a specific branch in the request path.
- A fresh generation request returns non-empty questions with the required schema.
- The frontend renders the questions and can submit them successfully.
- Provider configuration and repository documentation agree.
- The relevant narrow validation command passes, with any unrelated failures recorded separately.
