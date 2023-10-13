namespace LoginApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int CompanyId { get; set; }
        public bool IsAdmin { get; set; } = false;
        public bool IsMod   { get; set; } = false;
        public string? Box { get; set; }
    }

    public class PasswordReset{
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ResetToken { get; set; }
    }

public class OpenAnswers {
    public int Id { get; set; }
    public int UserId { get; set; }
    public int QuestionOpenId { get; set; }
    public string AnswerText { get; set; }
    public int Session { get; set; }
    public DateTime Date { get; set; }
}

public class TotalScore
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ScoreValueC { get; set; }
    public int ScoreValueS { get; set; }
    public int ScoreValueI { get; set; }
    public int ScoreValueD { get; set; }
    public DateOnly Date { get; set; }

    // Returns the id of the highest score
    public int GetHighestScoreId()
    {
        int maxScore = Math.Max(Math.Max(ScoreValueC, ScoreValueS), Math.Max(ScoreValueI, ScoreValueD));

        if (maxScore == ScoreValueC) return 4;
        if (maxScore == ScoreValueS) return 3;
        if (maxScore == ScoreValueI) return 2;
        if (maxScore == ScoreValueD) return 1;

        // Default to 1 in case all scores are 0
        return 1;
    }
}

}
