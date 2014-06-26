#import "ApplicationMods.h"

@implementation ApplicationMods

+ (NSArray*) compiledMods
{
	NSMutableArray *modules = [NSMutableArray array];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"paypal",@"name",@"ti.paypal",@"moduleid",@"1.7.0",@"version",@"806d55c1-4ff6-4b11-951a-115af5053252",@"guid",@"",@"licensekey",nil]];
	return modules;
}

@end