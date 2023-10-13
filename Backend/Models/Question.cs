namespace LoginApi.Models
{
    public class Question
{
    public int Id { get; set; }
    public string QuestionText { get; set; }
    public List<Answer> Answers { get; set; }

    public int CompanyId { get; set; }
}

public class OpenAnswerDTO
{
    public int QuestionId { get; set; }
    public string AnswerText { get; set; }
}


public class QuestionOpen {
    public int Id { get; set; }
    public string QuestionText { get; set; }
    public int CompanyId { get; set; }
    public List<AnswerOpen>? Answers { get; set; } 
}


public class AnswerOpenDTO
{
    public int Id { get; set; }
    public int QuestionOpenId { get; set; }
    public string AnswerText { get; set; }
}

public class AnswerOpen {
    public int Id { get; set; }
    public int QuestionOpenId { get; set; }
    public string AnswerText { get; set;}
     public QuestionOpen QuestionOpen { get; set; } 
}

public class AnswerOpenDB {
    public int Id { get; set; }
    public int QuestionOpenId { get; set; }
    public string AnswerText { get; set;}
    public int UserId { get; set; }
}
public class Answer
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string AnswerText { get; set; }
    public int ScoreValueD { get; set; }
    public int ScoreValueI { get; set; }
    public int ScoreValueS { get; set; }
    public int ScoreValueC { get; set; }
    public Question Question { get; set; }
}
public class QuestionOpenDTO
{
    public int Id { get; set; }
    public string QuestionText { get; set; }
    public int CompanyId { get; set; }
    public List<AnswerOpenDTO> Answers { get; set; }
}

public class QuestionDTO
{
    public int Id { get; set; }
    public string QuestionText { get; set; }
    public List<AnswerDTO>? Answers { get; set; }
    public int CompanyId { get; set; } // Add this line
}


public class AnswerDTO
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string AnswerText { get; set; }
    public int ScoreValueD { get; set; }
    public int ScoreValueI { get; set; }
    public int ScoreValueS { get; set; }
    public int ScoreValueC { get; set; }
}
}