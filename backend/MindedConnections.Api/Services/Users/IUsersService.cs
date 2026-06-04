using MindedConnections.Shared.Dtos;
using MindedConnections.Shared.Dtos.Users;
using MindedConnections.Shared.Queries;

namespace MindedConnections.Api.Services.Users;

public interface IUsersService
{
    Task<UserStats>                GetStatsAsync();
    Task<PagedResponse<UserDto>>   GetUsersAsync(UserListQuery query);
    Task<UserDto>                  GetUserAsync(string id);
    Task<UserDto>                  CreateProviderAsync(CreateProviderRequest req);
    Task<UserDto>                  CreatePatientAsync(CreatePatientRequest req);
    Task                           DeleteUserAsync(string id);
}
