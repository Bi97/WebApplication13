namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _2112 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SanPhams", "DonGia", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.SanPhams", "DonGia");
        }
    }
}
