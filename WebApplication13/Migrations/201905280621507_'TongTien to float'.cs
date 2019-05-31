namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TongTientofloat : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.DonHangs", "TongTien", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.DonHangs", "TongTien", c => c.Double(nullable: false));
        }
    }
}
