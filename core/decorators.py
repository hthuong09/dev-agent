import functools
from typing import Any, Callable, TypeVar

T = TypeVar('T')

def confirmation_required_tool(func: Callable[..., T]) -> Callable[..., T]:
    """
    A decorator that requires user confirmation before executing a tool.
    If user confirms with 'Y', the tool executes normally.
    If user denies with 'n', the tool execution is rejected.
    
    Args:
        func: The tool function to be wrapped
        
    Returns:
        The wrapped function that requires confirmation
    """
    @functools.wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> T:
        # Get function name for better UX
        func_name = func.__name__.replace('_', ' ').title()
        
        # Ask for confirmation
        confirmation = input(f"\nDo you want to execute {func_name}? [Y/n]: ")
        
        if confirmation.lower() != 'n':
            return func(*args, **kwargs)
        else:
            return "Tool execution permission is rejected this time. You either go with other tools or stop now."
            
    return wrapper 
