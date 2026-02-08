| name                    | definition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| update_user_xp          | CREATE OR REPLACE FUNCTION public.update_user_xp(user_id_input uuid, xp_to_add integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE profiles
  SET xp = COALESCE(xp, 0) + xp_to_add,
      updated_at = NOW()
  WHERE id = user_id_input;
  
  IF NOT FOUND THEN
    INSERT INTO profiles (id, xp, updated_at)
    VALUES (user_id_input, xp_to_add, NOW());
  END IF;
END;
$function$
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| increment_words_learned | CREATE OR REPLACE FUNCTION public.increment_words_learned(user_id_input uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    UPDATE user_stats
    SET words_learned = COALESCE(words_learned, 0) + 1
    WHERE user_id = user_id_input;
END;
$function$
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| update_srs_item         | CREATE OR REPLACE FUNCTION public.update_srs_item(user_id_input uuid, content_id_input uuid, content_type_input character varying, rating_input integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO srs_cards (user_id, item_id, item_type, difficulty, stability, due_date, last_review)
    VALUES (user_id_input, content_id_input, content_type_input, 5.0, 0.1, NOW(), NOW())
    ON CONFLICT (user_id, item_id) 
    DO UPDATE SET 
        reps = srs_cards.reps + 1,
        difficulty = CASE 
            WHEN rating_input = 1 THEN srs_cards.difficulty + 1.0
            WHEN rating_input = 4 THEN srs_cards.difficulty - 0.5
            ELSE srs_cards.difficulty 
        END,
        due_date = CASE 
            WHEN rating_input = 1 THEN NOW() + INTERVAL '1 minute'
            WHEN rating_input = 2 THEN NOW() + INTERVAL '1 day'
            WHEN rating_input = 3 THEN NOW() + INTERVAL '3 days'
            WHEN rating_input = 4 THEN NOW() + INTERVAL '7 days'
            ELSE NOW()
        END,
        last_review = NOW();
END;
$function$
 |
| on_audio_upload         | CREATE OR REPLACE FUNCTION public.on_audio_upload()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  perform net.http_post(
    url := 'https://zetczjqsavwzprrwyrpl.supabase.co/functions/v1/transcribe-lesson',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpldGN6anFzYXZ3enBycnd5cnBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU4ODU4MCwiZXhwIjoyMDg0MTY0NTgwfQ.P_n154F5TRDgly5M2WKRMtAFeoajirEBfAixdBoTKSE'
    ),
    body := jsonb_build_object('record', row_to_json(new))::jsonb -- שינוי ל-jsonb מפורש
  );
  
  return new;
end;
$function$
                                                                                                                                                                                                                                                                                                                                                                                                        || schemaname | tablename     | policyname                       | permissive | roles    | cmd    | qual                   | with_check |
| ---------- | ------------- | -------------------------------- | ---------- | -------- | ------ | ---------------------- | ---------- |
| public     | roots         | Public Roots                     | PERMISSIVE | {public} | SELECT | true                   | null       |
| public     | user_progress | Users manage own progress        | PERMISSIVE | {public} | ALL    | (auth.uid() = user_id) | null       |
| public     | user_stats    | Allow all                        | PERMISSIVE | {public} | ALL    | true                   | null       |
| public     | user_stats    | Allow update for all             | PERMISSIVE | {public} | ALL    | true                   | null       |
| public     | lessons       | Allow all for service role       | PERMISSIVE | {public} | ALL    | true                   | true       |
| public     | lessons       | Allow internal service access    | PERMISSIVE | {public} | ALL    | true                   | null       |
| public     | lessons       | Service role can do everything   | PERMISSIVE | {public} | ALL    | true                   | null       |
| public     | lessons       | Users can view their own lessons | PERMISSIVE | {public} | SELECT | (auth.uid() = user_id) | null       |