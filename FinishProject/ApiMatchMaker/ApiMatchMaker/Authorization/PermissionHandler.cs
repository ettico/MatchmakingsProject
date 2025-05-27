﻿    using Microsoft.AspNetCore.Authorization;
    using System.Threading.Tasks;


namespace ApiMatchMaker.Authorization
{

    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            var hasPermission = context.User.Claims
                .Any(c => c.Type == "Permission" && c.Value == requirement.Permission);

            if (hasPermission)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }

}
