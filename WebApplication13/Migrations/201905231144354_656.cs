namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _656 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.SanPhams", "DonGia", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.SanPhams", "DonGia", c => c.Single(nullable: false));
        }
    }
}
