using MediatR;
using Microsoft.AspNetCore.Mvc;
using ApiMF.Models.Dtos;
using ApiMF.Application.Companies.Queries.GetCompanies;
using ApiMF.Application.Companies.Queries.GetCompanyContacts;

namespace ApiMF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CompaniesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/companies
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CompanyDto>>> GetCompanies(
        [FromQuery] bool? canContactAd,
        [FromQuery] bool? canContactBb,
        [FromQuery] bool? canContactCa,
        [FromQuery] bool? canContactMi,
        [FromQuery] bool? canContactSh,
        [FromQuery] bool? canContactZa)
    {
        var result = await _mediator.Send(new GetCompaniesQuery(
            CanContactAd: canContactAd,
            CanContactBb: canContactBb,
            CanContactCa: canContactCa,
            CanContactMi: canContactMi,
            CanContactSh: canContactSh,
            CanContactZa: canContactZa));
        return Ok(result);
    }

    // GET: api/companies/{companyId}/contacts
    [HttpGet("{companyId:long}/contacts")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CompanyContactDto>>> GetCompanyContacts(long companyId)
    {
        var result = await _mediator.Send(new GetCompanyContactsQuery(companyId));
        return Ok(result);
    }

    // GET: api/companies/contacts?companyId=123
    [HttpGet("contacts")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CompanyContactDto>>> GetCompanyContactsByQuery([FromQuery] long companyId)
    {
        var result = await _mediator.Send(new GetCompanyContactsQuery(companyId));
        return Ok(result);
    }
}
