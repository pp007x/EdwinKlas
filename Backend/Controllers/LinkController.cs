using System.Linq;
using System.Collections.Generic;
using LoginApi.Models;
using Microsoft.AspNetCore.Mvc;
using LoginApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace LoginApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LinkController : ControllerBase
    {
        private readonly UserContext _context;

        public LinkController(UserContext context)
        {
            _context = context;
        }


        [HttpGet]
        [Authorize]
        public async Task<ActionResult<Link>> GetLink()
        {
            var usernameClaim = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == usernameClaim);

            if (user == null)
            {
                return NotFound();
            }

            var link = await _context.Links.FindAsync(user.CompanyId);
            if (link == null)
            {
                return NotFound();
            }

            return link;
}

[HttpGet("{companyId}")]
[Authorize(Roles = "Admin, Mod")]
public async Task<ActionResult<Link>> GetLink(int companyId)
{
    var company = await _context.Companies.FindAsync(companyId);
    
    if (company == null)
    {
        return NotFound();
    }

    var link = await _context.Links.FindAsync(companyId);

    if (link == null)
    {
        return NotFound();
    }

    return link;
}


[HttpPost]
[Authorize(Roles = "Admin, Mod")]
public async Task<ActionResult<Link>> PostLink(Link link)
{
    try
    {
        var existingLink = await _context.Links.FirstOrDefaultAsync(l => l.CompanyId == link.CompanyId);
        if (existingLink != null)
        {
            // If a link with the same companyId exists, update the existing link
            existingLink.Webadress = link.Webadress;
            existingLink.Name = link.Name;
            existingLink.CompanyId = link.CompanyId;
        }
        else
        {
            // If no link with the same companyId exists, add the new link
            _context.Links.Add(link);
        }
        await _context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
        // Handle any other exceptions that might occur
        return BadRequest(ex.Message);
    }

    return CreatedAtAction("GetLink", new { id = link.Id }, link);
}



    }
}
